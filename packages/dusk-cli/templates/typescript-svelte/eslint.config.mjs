import js from "@eslint/js";
import globals from "globals";
import duskPlugin from "dusk-games-sdk/eslint.js";
import tseslint from "typescript-eslint";
import svelteParser from "svelte-eslint-parser";

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
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
    },
  },
  {
    files: ["*.svelte"],
    languageOptions: {
      parser: svelteParser,
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
]
