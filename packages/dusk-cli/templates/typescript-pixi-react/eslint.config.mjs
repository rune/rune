import js from "@eslint/js";
import globals from "globals";
import duskPlugin from "dusk-games-sdk/eslint.js";
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'
import { fixupPluginRules } from "@eslint/compat";
import pluginReact from "eslint-plugin-react";
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
    plugins: {
      "react-refresh": pluginReactRefresh
    }
  },
  js.configs.recommended,
  duskPlugin.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": fixupPluginRules(pluginReactHooks),
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  }
]
