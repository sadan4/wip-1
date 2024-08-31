import { getKeyAsValue } from "./ast"
import type { Tree } from "./treeSitter"

const ENV_VARS = "window.GLOBAL_ENV"

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
export function getEnvBuildVars(tree: Tree, wrapNonLiterals = true) {
    const language = tree.getLanguage()
    // ${ENV_VARS} = @value
    const envAssignQuery = language.query(`((assignment_expression
            left: (member_expression) @obj
            right: (object) @value)
        (#eq? @obj ${JSON.stringify(ENV_VARS)}))`)

    const envAssignCaptures = envAssignQuery.captures(tree.rootNode)
    const envObj = envAssignCaptures.find(capture => capture.name === "value")?.node
    if (!envObj) return null

    const identQuery = language.query("(identifier)")
    const envVars: EnvBuildVars = { [UNREADABLE_KEYS]: [] }
    for (const pair of envObj.namedChildren) {
        const keyNode = pair.childForFieldName("key")
        const valueNode = pair.childForFieldName("value")
        if (!keyNode || !valueNode) continue

        let key: string | symbol | null = getKeyAsValue(keyNode)
        if (key == null) {
            key = Symbol("unreadableKey")
            envVars[UNREADABLE_KEYS].push(key)
        }

        if (wrapNonLiterals && identQuery.matches(valueNode).length > 0) {
            envVars[key] = { [IS_NONLITERAL]: true, expression: valueNode.text }
        } else {
            envVars[key] = new Function("return " + valueNode.text)()
        }
    }

    return envVars
}

export function getBuildNumber(tree: Tree) {
    const language = tree.getLanguage()
    // const query = language.query(`(identifier) @build`)
}
