import restructured from 'restructured'
import { crc16Le } from './crc.mjs'
// everything about Network Co Processor, parsing of the .rst doc, frame generation and parsing.



function createTitlePredicate (predicate) {
  return (el) => el.children && el.children[0].type === 'title' && predicate(el.children[0].children[0].value.trim())
}

const isFrameIdList = createTitlePredicate((title) => title === '5.1.6 Frame ID Lists')

function findElements (node, predicate, collected = undefined) {
  if (collected === undefined) {
    collected = []
  }

  try {
    if (predicate(node)) {
      collected.push(node)
    }
  } catch (e) {
    throw new Error(`err at node ${JSON.stringify(node)}`, {cause: e})
  }
  if (node.children) {
    for (const child of node.children) {
      findElements(child, predicate, collected)
    }
  }
  return collected
}

export function parseGridTable (paragraphNode, removeTopRows = 0) {
  const lines = []
  for (const tNode of paragraphNode.children) {
    lines.push(tNode.value.trimEnd())
  }
  // line[0] example: '+----------+---------------------------------+----------------+-----------------+'
  const columns = lines[0].split('+').filter(c => c)
  // columns: ['----------', '---------------------------------', '----------------','-----------------']
  const colDefs = []
  let pos = 0
  for (let i = 0; i < columns.length; i++) {
    const newPos = pos + columns[i].length
    colDefs.push([pos + 1, newPos])
    pos = newPos + 1
  }
  // colDefs: [ [ 1, 10 ], [ 12, 44 ], [ 46, 61 ], [ 63, 152 ] ]
  let sep = true
  const values = []
  let previousVal = null
  for (const line of lines.slice(removeTopRows * 2)) {
    sep = line.match(/^[| +-]+$/)
    if (sep) {
      if (previousVal) {
        // if we find an horiz. line, we squish the previous val in the col, so that if the next row as a gap in the same col, we don't fill it.
        const separatorLayout = colDefs.map(([from, to]) => line.substring(from, to).trim())
        // separatorLayout: ['', '----', '', '---']
        previousVal = separatorLayout.map((sep, index) => sep.match(/^-+$/) ? '' : previousVal[index])
      }
      continue
    }
    const val = []
    for (const col of colDefs) {
      let colVal = line.substring(col[0], col[1]).trim()
      if (!colVal && previousVal) {
        // empty cols get the value of their upper row
        colVal = previousVal[val.length]
      }
      val.push(colVal)
    }
    values.push(val)
    previousVal = val
  }
  return values
}

function findSectionForFrame (rootNode, frameIdText) {
  const predicate = createTitlePredicate((title) => title.endsWith(frameIdText))
  const section = findElements(rootNode, predicate)
  if (section.length > 0 && section[0].children.length > 2) {
    return section[0].children[2]
  }
  return null
}

export function parseArgTable (parsedTable, [opName, opId, opDesc]) {
  parsedTable = parsedTable.filter(r => r[1])
  for (let i = 0; i < parsedTable.length; i++) {
    const row = parsedTable[i]
    if (!row[1].includes(':')) {
      // this line doesn't have a type annotation. It might be the continuation of the previous line
      if (i > 0) {
        parsedTable[i - 1][1] += ' ' + row[1]
      }
    }
  }
  // parsedTable: [['Response Parameters:',  'esp_ncp_status_t status: Status value indicating success or the reason for failure'] ]
  parsedTable = parsedTable.map(r => [r[0], ...r[1].split(':').map(s => s.trim())])
  // NETWORK_PERMIT_JOINING has a weird doc with multiple ':' over multiple lines for the same param, patching it
  /*[ 'Command Parameters:', 'uint8_t      duration', 'A value of 0x00 disables joining'],
    [ 'Command Parameters:', '', 'A value of 0xFF enables joining' ],
    [ 'Command Parameters:', '', 'Other value enables joining for that number of seconds' ]
  */
  const deleteIndices = new Set()
  for (let i = parsedTable.length - 1; i > 0; i--) {
    // go backwards to be able to collapse more than one row
    const row = parsedTable[i]
    if (row[1] === '') {
      parsedTable[i - 1][2] += '. ' + row[2]
      deleteIndices.add(i) // delete doesn't work in JS
    }
  }
  parsedTable = parsedTable.filter((_, i) => !deleteIndices.has(i))
  // parsedTable: [
  //   ['Command Parameters:', 'None' ],
  //   ['Response Parameters:', 'uint32_t role', 'The Zigbee device the 2.4G channel mask' ]]
  parsedTable = parsedTable.filter(r => r.length > 2)
  const splitTypeVariable = (str) => {
    // NETWORK_FORM and NETWORK_JOIN have a field used for 2 purposes, it's documented as such:
    // uint8_t max_children or ed_timeout
    //str:  'uint8_t  max_children or ed_timeout'
    // using \s+ because sometimes the type is separated by more than one space
    let [type, ...vName] = str.split(/\s+/)
    // type: uint8_t
    // vName: [ 'max_children', 'or', 'ed_timeout']
    vName = vName.join('_')
    // APS_DATA_REQUEST.asdu is declared vith the brackets on the variable instead of type, fixing it
    if (vName.endsWith('[]')) {
      type = type + '[]'
      vName = vName.slice(0, vName.length - 2)
    }
    // clean up the variable names, some of them have punctuation in the name
    vName = vName.replace(/[^A-Za-z0-9_]/g, '')
    // remove brackets from typename to appease TypeScript
    if (type.endsWith('[]')) {
      type = type.substring(0, type.length - 2) + '_vec'
    }
    type = type.replace(/\[([0-9]+)]/, '_v$1')
    return [vName, type]
  }
  parsedTable = parsedTable.map(r => [r[0], ...splitTypeVariable(r[1]), r[2]])
  // parsedTable: [['Response Parameters:', 'role', 'uint32_t', 'The Zigbee device the 2.4G channel mask' ]]
  const inputParams = parsedTable.filter(r => r[0].startsWith('Command ')).map(r => r.slice(1))
  const outputParams = parsedTable.filter(r => r[0].startsWith('Response ')).map(r => r.slice(1))
  const notifyParams = parsedTable.filter(r => r[0].startsWith('Notify ')).map(r => r.slice(1))

  return {
    id: parseInt(opId),
    name: opName,
    description: opDesc,
    REQUEST: renameDuplicateParams(inputParams),
    RESPONSE: renameDuplicateParams(outputParams),
    NOTIFY: renameDuplicateParams(notifyParams)
  }
}

export function parseNcpApi (rstText) {
  const parsed = restructured.default.parse(rstText)
  let frameTypeTableSection = findElements(parsed, isFrameIdList)[0]
  let operations = parseGridTable(frameTypeTableSection.children[1], 1)
  const documentedOperations = {}
  const undocumentedOperations = {}
  for (const op of operations) {
    // op: [ 'ZCL', 'ZCL_READ', '0x0106', 'Read APS on NCP endpoints' ]
    let argTableSection = findSectionForFrame(parsed, op[1])
    if (argTableSection) {
      let parsedTable = parseGridTable(argTableSection)
      documentedOperations[op[1]] = parseArgTable(parsedTable, op.slice(1))
    } else {
      undocumentedOperations[op[1]] = {id: parseInt(op[2]), name: op[1]}
      console.log(op[1], ':(')
    }
  }
  const id2op = new Map(Object.values(documentedOperations).map(v => [v.id, v]))
  return {documentedOperations, undocumentedOperations, id2op}
}

function renameDuplicateParams (params) {
  const paramNames = new Set()
  for (const param of params) {
    const origName = param[0]
    let name = origName
    let index = 2
    while (paramNames.has(name)) {
      name = origName + index
      param[0] = name
      index++
    }
    paramNames.add(name)
  }
  return params
}

const HEADER_LEN = 7
const CSUM_LEN = 2

const SIZEOF_MAP = {
  bool: 1, //taken from zigpy-espzb
  uint8_t: 1, esp_ncp_status_t: 1, esp_ncp_secur_t: 1, uint16_t: 2, uint32_t: 4, uint8_t_v8: 8, uint8_t_v16: 16
}

function read_uint8_t_v (view, p, len) {
  const res = new Uint8Array(len)
  for (let i = 0; i < Math.min(len, view.byteLength - p); i++) {
    res[i] = view.getUint8(p + i)
  }
  return res
}

function write_uint8_t_v (view, p, val) {
  for (let i = 0; i < val.length; i++) {
    view.setUint8(p + i, val[i])
  }
}

// DataView accessors
const ACCESS_MAP = {
  bool: {set: (view, p, val) => view.setUint8(p, val), get: (view, p) => view.getUint8(p)},
  uint8_t: {set: (view, p, val) => view.setUint8(p, val), get: (view, p) => view.getUint8(p)},
  esp_ncp_status_t: {set: (view, p, val) => view.setUint8(p, val), get: (view, p) => view.getUint8(p)},
  esp_ncp_secur_t: {set: (view, p, val) => view.setUint8(p, val), get: (view, p) => view.getUint8(p)},
  uint16_t: {set: (view, p, val) => view.setUint16(p, val, true), get: (view, p) => view.getUint16(p, true)},
  uint32_t: {set: (view, p, val) => view.setUint32(p, val, true), get: (view, p) => view.getUint32(p, true)},
  uint8_t_v8: {set: write_uint8_t_v, get: (view, p) => read_uint8_t_v(view, p, 8)},
  uint8_t_v16: {set: write_uint8_t_v, get: (view, p) => read_uint8_t_v(view, p, 16)}
}

function sizeof (apiType) {
  if (apiType in SIZEOF_MAP) {
    return SIZEOF_MAP[apiType]
  }

  throw new Error(`API type '${apiType}' not supported`)
}

function accessorsof (apiType) {
  if (apiType in ACCESS_MAP) {
    return ACCESS_MAP[apiType]
  }

  throw new Error(`API type '${apiType}' not supported`)
}

function computeFrameSize (frameDoc, direction) {
  let size = HEADER_LEN + CSUM_LEN
  console.log('dir', direction, frameDoc)
  for (const param of frameDoc[direction]) {
    size += sizeof(param[1])
  }
  return size
}

export const TYPE_TEXT = ['REQUEST', 'RESPONSE', 'NOTIFY']

export function createFrame (doc, seqNum, args = {}, direction = 'REQUEST') {
  const size = computeFrameSize(doc, direction)

  console.log('size', size)
  // https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#frame-format
  const buffer = new ArrayBuffer(size)
  const bufferView = new DataView(buffer)
  const flags = 0x0000 | (TYPE_TEXT.indexOf(direction) << 4)
  bufferView.setUint16(0, flags, true)
  bufferView.setUint16(2, doc.id, true)
  bufferView.setUint8(4, seqNum)
  bufferView.setUint16(5, size - 9, true)
  let parameters = doc[direction]
  console.log('frame doc', parameters)
  const payloadView = new DataView(buffer, HEADER_LEN, size - HEADER_LEN - CSUM_LEN)
  let pos = 0
  for (const [name, type, _] of parameters) {
    const pSize = sizeof(type)
    const accessors = accessorsof(type)
    let val = args[name]
    console.log('param', pos, name, val)
    accessors.set(payloadView, pos, val)
    pos += pSize
  }
  const crc = crc16Le(0xFFFF, new Uint8Array(buffer, 0, size - CSUM_LEN))
  console.log('crc', crc.toString(16))
  bufferView.setUint16(size - 2, crc, true)
  console.log('Frame', buffer)
  return new Uint8Array(buffer)
}

export function parseFrame (buffer, id2op) {
  console.log('GOT FRAME', buffer.byteLength, buffer)
  let bufferView
  if (ArrayBuffer.isView(buffer)) {
    bufferView = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
  } else {
    bufferView = new DataView(buffer)
  }
  // console.log('as text', new TextDecoder("utf-8").decode(buffer))
  const flags = bufferView.getUint8(0)
  const version = flags & 0b1111
  const type = (flags >> 4) & 0b1111

  const frameId = bufferView.getUint16(2, true)
  const sequenceNumber = bufferView.getUint8(4)
  const size = bufferView.getUint16(5, true)
  console.log('  payload size in header', size)
  console.log('  payload bytes between header and checksum', buffer.byteLength - HEADER_LEN - CSUM_LEN)
  const payloadView = new DataView(bufferView.buffer, bufferView.byteOffset + HEADER_LEN, size)
  console.log('  flags 0x', flags.toString(16))
  console.log('  version', version)
  let typeText = TYPE_TEXT[type]
  console.log('  type', type, typeText)
  console.log('  frameId 0x', frameId.toString(16))
  let frameDoc = id2op.get(frameId)

  const payload = {}
  if (frameDoc) {
    console.log('  frame ID', frameDoc.name)
    console.log('  frame type', frameDoc[typeText])
    console.log('  payload size according to typedef', computeFrameSize(frameDoc, typeText) - HEADER_LEN - CSUM_LEN)
    let pos = 0
    for (const [name, type, _] of frameDoc[typeText]) {
      payload[name] = accessorsof(type).get(payloadView, pos)
      pos += sizeof(type)
    }
  }
  console.log('  payload', payload)
  console.log('  sequenceNumber', sequenceNumber)
  console.log('  length', size)
  if (payloadView.byteLength === 1) {
    console.log('  payload', payloadView.getUint8(0))
  }
  const crc = crc16Le(0xFFFF, new Uint8Array(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength - CSUM_LEN))
  console.log('  computed crc', crc.toString(16))
  console.log('  frame    crc', bufferView.getUint16(bufferView.byteLength - 2, true).toString(16))
  return {version, type: typeText, frameId, sequenceNumber, payload}
}

