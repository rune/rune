import js from "@eslint/js";
import globals from "globals";
import duskPlugin from "dusk-games-sdk/eslint.js";
import tseslint from "typescript-eslint";

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
  duskPlugin.configs.recommended,
  ...tseslint.configs.recommended
]
