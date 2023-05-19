import type { ESLint } from "eslint"
import * as noParentScopeMutation from "./no-parent-scope-mutation"

export const rules: ESLint.Plugin["rules"] = {
  "no-parent-scope-mutation": noParentScopeMutation,
}
