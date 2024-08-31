import TreeSitter, { type Parser } from "@vscode/tree-sitter-wasm"
import treesitterUrl from "@vscode/tree-sitter-wasm/wasm/tree-sitter.wasm?url"
import tsGrammarUrl from "@vscode/tree-sitter-wasm/wasm/tree-sitter-typescript.wasm?url"

// @ts-ignore - tree-sitter-wasm types are really bad
const p: typeof Parser = TreeSitter
export type Options = Parser.Options
export type Point = Parser.Point
export type Range = Parser.Range
export type Edit = Parser.Edit
export type Logger = Parser.Logger
export type Input = Parser.Input
export type SyntaxNode = Parser.SyntaxNode
export type TreeCursor = Parser.TreeCursor
export type Tree = Parser.Tree
export type QueryCapture = Parser.QueryCapture
export type QueryMatch = Parser.QueryMatch
export type QueryOptions = Parser.QueryOptions
export type PredicateResult = Parser.PredicateResult
export type Query = Parser.Query
export type LookaheadIterable = Parser.LookaheadIterable

export let parser: Parser
export let tsLanguage: Parser.Language

let initPromise: Promise<void> | null = null
export async function initParser() {
    return initPromise ??= init()
}

async function init() {
    await p.init({
        locateFile(scriptName: string) {
            if (scriptName === "tree-sitter.wasm") return treesitterUrl

            throw new Error(`Could not find script that tree-sitter requested: ${scriptName}`)
        },
    })

    tsLanguage = await p.Language.load(tsGrammarUrl)

    parser = new p()
    parser.setLanguage(tsLanguage)

    // @ts-ignore
    window.parser = parser
}
