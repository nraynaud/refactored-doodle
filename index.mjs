import { SlipDecoder, SlipEncoder } from '@serialport/parser-slip-encoder'
import { readdirSync } from 'fs'
import fs from 'node:fs/promises'
import { SerialPort } from 'serialport'
import { generateAPIFile } from './ncpGenDecl.mjs'
import { createFrame, parseFrame, parseNcpApi } from './ncpParsing.mjs'

const devFiles = readdirSync('/dev').filter((file) => file.startsWith('cu.usbmodem5'))
const SERIAL = `/dev/${devFiles[0]}`
console.log('SERIAL FILE', SERIAL)
let API_FILE = 'ESPFiles/ncp.rst'

console.log('serial ports', await SerialPort.list())

const {
  documentedOperations,
  undocumentedOperations,
  id2op
} = parseNcpApi(await fs.readFile(API_FILE, {encoding: 'utf8'}))

const content = generateAPIFile(documentedOperations)
await fs.writeFile('generated/NCP.d.ts', content, { encoding: 'utf8' })
console.log('NETWORK_SCAN_COMPLETE_HANDLER', documentedOperations['NETWORK_SCAN_COMPLETE_HANDLER'])
const allTypes = new Set()
const allParamNames = new Set()
for (const op of Object.values(documentedOperations)) {
  for (const direction of ['REQUEST', 'RESPONSE', 'NOTIFY']) {
    for (const param of op[direction]) {
      allTypes.add(param[1])
      allParamNames.add(param[0])
    }
  }
}
console.log('all type: ', allTypes)
console.log('all params: ', allParamNames)

const uart = new SerialPort({path: SERIAL, baudRate: 115200})
const encoder = new SlipEncoder({START: 0xc0})
encoder.pipe(uart)
const decoder = new SlipDecoder()
decoder.on('data', data => {console.log('data', parseFrame(data, id2op))})
uart.pipe(decoder)
let sequenceNumber = 0

async function writeToUart (frame) {
  return new Promise((resolve, reject) => {
    encoder.write(frame, null, (err, val) => {err ? reject(err) : resolve(val)})
  })
}

console.log('##############writing frame1')
await writeToUart(createFrame(documentedOperations['NETWORK_INIT'], sequenceNumber++, {}))
await writeToUart(createFrame(documentedOperations['NETWORK_START_SCAN'], sequenceNumber++, {channel_mask: 0x07FFF800, scan_duration:5}))
/*
console.log('writing frame2')
await writeToUart(createFrame(documentedOperations['NETWORK_LINK_KEY_GET'], sequenceNumber++))
console.log('done!')


 */
