import js from "@eslint/js"
import duskPlugin from "dusk-games-sdk/eslint.js"
import prettier from "eslint-plugin-prettier/recommended"
import globals from "globals"

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  js.configs.recommended,
  ...duskPlugin.configs.recommended,
  prettier,
]
