import globals from "globals"
import js from "@eslint/js"
import duskPlugin from "eslint-plugin-dusk"
import tseslint from "typescript-eslint"

export default [
  {
    languageOptions: {
      globals: {
        ...globals.es2020,
        ...globals.browser,
      },
      sourceType: "module",
      ecmaVersion: "latest",
    },
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  duskPlugin.configs.recommended,
]
