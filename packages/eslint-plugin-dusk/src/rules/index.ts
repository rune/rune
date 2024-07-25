import type { ESLint } from "eslint"
import * as noGlobalScopeMutation from "./no-global-scope-mutation.js"

export const rules: ESLint.Plugin["rules"] = {
  "no-global-scope-mutation": noGlobalScopeMutation,
}
