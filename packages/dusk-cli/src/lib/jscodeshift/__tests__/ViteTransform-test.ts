import { defineTest } from "jscodeshift/src/testUtils"

defineTest(__dirname, "ViteTransform", null, "vite", { parser: "ts" })
