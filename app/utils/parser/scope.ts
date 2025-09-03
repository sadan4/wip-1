import type { ScopeManager, Variable } from "eslint-scope"
import type { Identifier } from "estree"

export function findVariableByReference(scopeManager: ScopeManager, identifier: Identifier) {
    let variable: Variable | undefined

    for (const scope of scopeManager.scopes) {
        variable = scope.variables.find((variable) => variable.references.some((ref) => ref.identifier === identifier))
        if (variable) break
    }

    if (!variable) console.log(scopeManager.scopes.filter(scope => scope.variables.some(v => v.name === identifier.name)))

    return variable
}
