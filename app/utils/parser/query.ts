import { parseScript, stringify, queryMany, queryOne } from "./parse"

export const UNREADABLE_KEYS = Symbol("buildVar.unreadableKeys")
const IS_NONLITERAL = Symbol("value.isNonLiteral")
type NonLiteralValue = { [IS_NONLITERAL]: true, expression: string }
export function isNonLiteral(value: JsonType | NonLiteralValue): value is NonLiteralValue {
    if (value == null) return false
    if (typeof value !== "object") return false
    if (!(IS_NONLITERAL in value)) return false
    return true
}

export type JsonType = string | number | boolean | null | JsonType[] | { [key: string]: JsonType }
export type EnvBuildVars = Record<string | symbol, JsonType | NonLiteralValue> & { [UNREADABLE_KEYS]: symbol[] }
export function getEnvBuildVars(script: string, wrapNonLiterals = true) {
    const program = parseScript(script)
    const envObj = queryOne(program, "AssignmentExpression[left.object.name=window][left.property.name=GLOBAL_ENV] > ObjectExpression.right")
    if (!envObj) return null

    const envVars: EnvBuildVars = { [UNREADABLE_KEYS]: [] }
    for (const { key: keyNode, value: valueNode } of queryMany(envObj, "Property.properties")) {
        let key: string | symbol | null = null

        if (keyNode.type === "Identifier") key = keyNode.name
        else if (keyNode.type === "Literal") {
            if (typeof keyNode.value === "string") key = keyNode.value
        }

        if (key == null) {
            key = Symbol("unreadableKey")
            envVars[UNREADABLE_KEYS].push(key)
        }

        if (wrapNonLiterals && queryOne(valueNode, "Identifier")) {
            envVars[key] = { [IS_NONLITERAL]: true, expression: stringify(valueNode) }
        } else {
            envVars[key] = new Function("return " + stringify(valueNode))()
        }
    }

    return envVars
}
