import type { ArrowFunctionExpression, AssignmentExpression, Function, FunctionExpression, ObjectExpression, Program } from "estree"
import { walk } from "estree-walker"

import { analyze, Variable } from "eslint-scope"
import { findVariableByReference } from "./scope"
import { stringify } from "./parse"

const HAS_OWN_PROP_KEY = "o"
const HAS_OWN_PROP_PATTERN = /\(([a-z]), ([a-z])\) => Object\.prototype\.hasOwnProperty\.call\(\1, \2\)/
const JS_CHUNKS_KEY = "u"

export type WebpackModules = Record<string, FunctionExpression | ArrowFunctionExpression>
export interface WebpackBootstrap {
    modules: WebpackModules
    chunks: Record<string, string>
}
export function getWebpackBootstrap(program: Program): WebpackBootstrap | null {
    const toRestore: { object: ObjectExpression, props: ObjectExpression['properties'] }[] = []
    walk(program, {
        enter(node) {
            if (node.type !== "ObjectExpression") return
            if (node.properties.length < 100) return

            toRestore.push({ object: node, props: node.properties })
            node.properties = []
        },
    })

    const scopeManager = analyze(program, { ecmaVersion: 2022, sourceType: "module" })

    for (const { object, props } of toRestore) object.properties = props

    let webpackRequire: {
        var: Variable
        def: Function
    } | undefined
    walk(program, {
        enter(node) {
            if (webpackRequire) return this.skip()
            if (node.type === "ObjectExpression") return this.skip()

            if (!(
                node.type === "AssignmentExpression"
                && node.left.type === "MemberExpression"
                && node.left.object.type === "Identifier"
                && node.left.property.type === "Identifier"
                && node.left.property.name === HAS_OWN_PROP_KEY
                && HAS_OWN_PROP_PATTERN.test(stringify(node.right))
            )) return

            const webpackRequireVar = findVariableByReference(scopeManager, node.left.object)
            if (webpackRequireVar?.defs.length !== 1) return

            const webpackRequireDef = webpackRequireVar.defs[0]!
            if (webpackRequireDef.type !== "FunctionName") return

            webpackRequire = { var: webpackRequireVar, def: webpackRequireDef.node }

            this.skip()
        }
    })
    if (!webpackRequire) return null

    let webpackModules: {
        var: Variable
        def: ObjectExpression
    } | undefined

    walk(webpackRequire.def, {
        enter(node) {
            if (webpackModules) return this.skip()
            if (node.type === "ObjectExpression") return this.skip()

            if (!(
                node.type === "CallExpression"
                && node.callee.type === "MemberExpression"
                && node.callee.computed === false
                && node.callee.property.type === "Identifier"
                && node.callee.property.name === "call"
                && node.callee.object.type === "MemberExpression"
                && node.callee.object.computed === true
                && node.callee.object.object.type === "Identifier"
            )) return

            const webpackModulesVar = findVariableByReference(scopeManager, node.callee.object.object)
            if (webpackModulesVar?.defs.length !== 1) return

            const webpackModulesDef = webpackModulesVar.defs[0]!
            if (webpackModulesDef.type !== "Variable") return
            if (webpackModulesDef.node.init?.type !== "ObjectExpression") return

            webpackModules = { var: webpackModulesVar, def: webpackModulesDef.node.init }
            this.skip()
        },
    })
    if (!webpackModules) return null

    let webpackChunksDef: AssignmentExpression | undefined
    walk(program, {
        enter(node) {
            if (webpackChunksDef) return this.skip()
            if (node.type === "ObjectExpression") return this.skip()

            if (!(
                node.type === "AssignmentExpression"
                && node.left.type === "MemberExpression"
                && node.left.object.type === "Identifier"
                && node.left.property.type === "Identifier"
                && node.left.property.name === JS_CHUNKS_KEY
            )) return

            webpackChunksDef = node
            this.skip()
        }
    })
    if (!webpackChunksDef) return null

    let webpackChunks: Record<string, string> | undefined

    walk(webpackChunksDef, {
        enter(node) {
            if (webpackChunks) return this.skip()
            if (node.type !== "ObjectExpression") return

            webpackChunks = {}
            for (const { key, value } of getSimpleProps(node)) {
                if (value.type !== "Literal" || typeof value.value !== "string") continue
                webpackChunks[key] = value.value
            }
            this.skip()
        }
    })
    if (!webpackChunks) return null

    return {
        modules: getModules(webpackModules.def),
        chunks: webpackChunks,
    }
}

export function* getSimpleProps(object: ObjectExpression) {
    for (const prop of object.properties) {
        if (prop.type !== "Property") continue
        if (prop.computed || prop.method || prop.shorthand) continue

        if (prop.key.type === "Identifier") yield { key: prop.key.name, value: prop.value }
        if (prop.key.type === "Literal") yield { key: `${prop.key.value}`, value: prop.value }
    }
}

export function getModules(object: ObjectExpression) {
    const modules: WebpackModules = {}

    for (const { key, value } of getSimpleProps(object)) {
        if (value.type !== "ArrowFunctionExpression" && value.type !== "FunctionExpression") continue
        modules[key] = value
    }

    return modules
}
