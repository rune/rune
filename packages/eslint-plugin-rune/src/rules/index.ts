import type { ESLint } from "eslint"
import * as noParentScopeVariables from "./no-parent-scope-variables"

export const rules: ESLint.Plugin["rules"] = {
  "no-parent-scope-variables": noParentScopeVariables,
}
