import { defineTest } from "jscodeshift/src/testUtils"

defineTest(__dirname, "RuneToDuskTransform", null, "Logic", { parser: "ts" })
defineTest(__dirname, "RuneToDuskTransform", null, "Client", { parser: "ts" })
