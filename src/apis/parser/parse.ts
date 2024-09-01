import { parse } from "acorn"
import { generate } from "astring"
import type { Node, Program } from "estree"
import type { Query } from "magic-esquery"
import q, { type query } from "esquery"
const esquery = q as typeof query

export function parseScript(script: string) {
    return parse(script, { ecmaVersion: "latest", sourceType: "script" }) as Program
}

export function stringify(node: Node) {
    return generate(node, {})
}

export function queryMany<const Q extends string>(node: Node, query: Q) {
    return esquery(node, query, {}) as Query<Q, Node>[]
}
export function queryOne<const Q extends string>(node: Node, query: Q) {
    return (esquery(node, query, {})[0] ?? null) as Query<Q, Node> | null
}
