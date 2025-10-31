import { SlipDecoder } from '@serialport/parser-slip-encoder'
import assert from 'node:assert/strict'
import test from 'node:test'
import restructured from 'restructured'
import { parseFrame, parseGridTable } from './ncpParsing.mjs'

test('reference frames are correctly parsed', (t) => {
  const nwk_op = {
    id: 9,
    name: 'NETWORK_SCAN_COMPLETE_HANDLER',
    REQUEST: [],
    RESPONSE: [['status', 'esp_ncp_status_t', 'Status value indicating success or the reason for failure']],
    NOTIFY: [['status', 'uint8_t', 'The ZDO response status'], ['count', 'uint8_t', 'Number of discovered networks'], ['short_pan_id', 'uint16_t', 'PAN id'], ['permit_joining', 'bool', 'Indicates that at least one router/coordinator on the network currently permits joining'], ['extended_panid', 'uint8_t_v8', 'The IEEE address for the source']]
  }
  const id2op = new Map([[nwk_op.id, nwk_op]])
  const testDecoder = new SlipDecoder()
// reference frame from the doc page bottom
// it's SLIP-encoded
  let refFrame1 = 'c0 00 00 09 00 09 07 00 00 00 14 00 00 00 00 FA 45 c0'
  let expect1 = {frameId: 9, sequenceNumber: 9, type: 'REQUEST', version: 0, payload: {}}
  let refFrame2 = 'c0 10 00 09 00 09 01 00 00 99 00 c0'
  let expect2 = {frameId: 9, sequenceNumber: 9, type: 'RESPONSE', version: 0, payload: {status: 0}}
  let refFrame3 = 'c0 20 00 09 00 1a 0b 00 f7 39 f7 fe ff f9 55 60 4b fc 0d 20 00 c0'
  let expect3 = {
    frameId: 9, sequenceNumber: 26, type: 'NOTIFY', version: 0, payload: {
      count: 57,
      // the ref frame doesn't correspond the documented fields (it's too short by 2 bytes), so the panid is truncated
      extended_panid: Uint8Array.from([249, 85, 96, 75, 252, 13, 0, 0]),
      permit_joining: 255,
      short_pan_id: 65271,
      status: 247
    }
  }
  const refFrames = [[refFrame1, expect1], [refFrame2, expect2], [refFrame3, expect3]]
  for (const [ref, expect] of refFrames) {
    const refFrame = Uint8Array.from(ref.split(' ').map(byte => parseInt(byte, 16)))
    testDecoder.write(refFrame)
    const framed = testDecoder.read()
    const res = parseFrame(framed, id2op)
    assert.deepEqual(res, expect)
  }
})

test('can parse a simple RST grid', (t) => {
  const input = `
+----------+---------------------------------+----------------+------------------------------------------------------------------------------------------+
| Group ID | Frame Name                      | Frame ID       | Function                                                                                 |
+----------+---------------------------------+----------------+------------------------------------------------------------------------------------------+
|  Network | NETWORK_INIT                    | 0x0000         | Resume network operation after a reboot                                                  |
+----------+---------------------------------+----------------+------------------------------------------------------------------------------------------+
`
  const parsed = restructured.default.parse(input).children[0]
  assert.deepEqual(parseGridTable(parsed), [
    ['Group ID', 'Frame Name', 'Frame ID', 'Function'],
    ['Network', 'NETWORK_INIT', '0x0000', 'Resume network operation after a reboot']])
  assert.deepEqual(parseGridTable(parsed, 1), [
    ['Network', 'NETWORK_INIT', '0x0000', 'Resume network operation after a reboot']])
})

test('can parse a RST grid with merged cells', (t) => {
  const input = `
+----------+---------------------------------+----------------+------------------------------------------------------------------------------------------+
| Group ID | Frame Name                      | Frame ID       | Function                                                                                 |
+          +---------------------------------+----------------+------------------------------------------------------------------------------------------+
|          | NETWORK_INIT                    | 0x0000         | Resume network operation after a reboot                                                  |
+----------+---------------------------------+----------------+------------------------------------------------------------------------------------------+
`
  const parsed = restructured.default.parse(input).children[0]
  assert.deepEqual(parseGridTable(parsed), [
    ['Group ID', 'Frame Name', 'Frame ID', 'Function'],
    ['Group ID', 'NETWORK_INIT', '0x0000', 'Resume network operation after a reboot']])
})
