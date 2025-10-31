import { TYPE_TEXT } from './ncpParsing.mjs'

// generate the Typescript declaration file from the parsed operations

export function generateAPIFile (documentedOperations) {
  const allTypes = new Set()
  for (const op of Object.values(documentedOperations)) {
    for (const direction of TYPE_TEXT) {
      for (const param of op[direction]) {
        allTypes.add(param[1])
      }
    }
  }

  let classes = Object.values(documentedOperations).map(generateClass)
  classes = classes.flat(Infinity)
  const baseTypes = generateBaseTypes(Array.from(allTypes))
  return ''.concat(...baseTypes, ...classes)
}

function generateBaseTypes (types) {
  const numeric = ['esp_ncp_status_t', 'esp_ncp_secur_t', 'bool', 'uint8_t', 'uint16_t', 'uint32_t']
  // https://stackoverflow.com/a/56749647/72637
  const tagDecl = `declare const tag: unique symbol\n`
  const typeDecl = numeric.map(t => `export type ${t} = number & { readonly [tag]: '${t}' };\n`)
  const non_num = types.filter(t => !numeric.includes(t))
  const nonnumTypeDecl = non_num.map(t => `export type ${t} = { readonly [tag]: '${t}' };\n`)
  return [tagDecl].concat(typeDecl, nonnumTypeDecl)
}

function generateClass (operation) {
  const opTypes = TYPE_TEXT.filter(t => t in operation && operation[t])
  const functions = opTypes.map(type => generateOpType(operation, type))
  const generatedHash = operation.name.toLowerCase().replaceAll('_', '-')
  return [`
/** ${operation.description}
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#${generatedHash}| Online doc} **/
export class ${operation.name} {
`, functions, `}
`]
}

function generateOpType (operation, type) {
  const params = operation[type].map(p => `${p[0]}: ${p[1]}`)
  const paramDocs = operation[type].map(p => `    * @param ${p[0]} ${p[2]}`)
  const opDoc = `    /**
${paramDocs.join('\n')}
    **/
`
  return [params.length ? opDoc : '',
    `    ${type}(`, params.join(', '), `): void;\n`]
}
