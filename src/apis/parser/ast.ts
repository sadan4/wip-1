import { type SyntaxNode } from "./treeSitter"

export function getKeyAsValue(node: SyntaxNode) {
    if (node.type === "property_identifier") return node.text
    if (node.type === "string") return node.firstChild!.text
    return null
}
