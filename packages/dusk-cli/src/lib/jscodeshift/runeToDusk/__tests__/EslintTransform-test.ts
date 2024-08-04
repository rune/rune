import { defineTest } from "jscodeshift/src/testUtils"

defineTest(__dirname, "EslintTransform", null, "eslintrc")
// defineTest(__dirname, "RuneToDuskTransform", null, "Client", { parser: "ts" })
