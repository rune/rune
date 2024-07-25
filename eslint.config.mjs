import prettier from "eslint-plugin-prettier/recommended"
import globals from "globals"
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactPlugin from "eslint-plugin-react"
import duskPlugin from "eslint-plugin-dusk"
import importPlugin from "eslint-plugin-import"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import nodePlugin from "eslint-plugin-n"
export default [
  {
    ignores: [
      "**/dist",
      "**/build",
      "**/.docusaurus",
      "**/examples",
      "packages/dusk-cli/__temp/",
      "packages/dusk-cli/src/generated/",
      "packages/dusk-cli/templates/",
      "packages/dusk-cli/templates/",
      "packages/dusk-cli/src/lib/jscodeshift/__testfixtures__",
      "packages/vite-plugin-dusk/test/fixtures/",
      "packages/vite-plugin-dusk/playground/",
      "packages/dusk-cli/cjs/",
      "packages/dusk-cli/cjs/",
      "**/node_modules/",
      "docs/static/_examples",
      "docs/static/_tech-demos",
      "docs/src/theme",
      "**/scripts/",
    ],
  },
  js.configs.recommended,
  prettier,

  //Only run it on ts files
  ...tseslint.configs.recommended.map((config) => ({
    files: ["**/*.tsx", "**/*.ts"],
    ...config,
  })),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        jsx: true,
      },
    },
    rules: {
      "prettier/prettier": ["error"],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: [
      "packages/eslint-plugin-dusk/**/*.spec.js",
      "packages/eslint-plugin-dusk/test/createConfigTester.js",
    ],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  {
    files: ["packages/eslint-plugin-dusk/test/samples/*.js"],
    ...duskPlugin.configs.logic,
  },
  ...duskPlugin.configs.recommended,
  {
    files: ["docs/**/*.js"],
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },

  {
    files: ["packages/dusk-cli/**"],
    plugins: {
      n: nodePlugin,
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      "max-lines": ["warn", 2000],
      "no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": "error",
      eqeqeq: ["error"],
      "no-extra-semi": ["off"],
      "n/no-unsupported-features/es-builtins": ["error"],
      "n/no-unsupported-features/es-syntax": ["off"],
      "n/no-unsupported-features/node-builtins": ["error"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "no-else-return": [
        "error",
        {
          allowElseIf: false,
        },
      ],
      "object-shorthand": ["error", "properties"],
      curly: ["error", "multi-line", "consistent"],
      "arrow-body-style": ["error", "as-needed"],
      "no-lonely-if": "error",
      "no-unneeded-ternary": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
        },
      ],
      "prefer-template": "error",
      "@typescript-eslint/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: ["const", "let"],
          next: ["block-like", "if", "multiline-expression", "export"],
        },
        {
          blankLine: "always",
          prev: ["block-like", "if", "multiline-expression", "export"],
          next: ["const", "let"],
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["return", "block-like", "interface"],
        },
        {
          blankLine: "always",
          prev: ["block-like", "interface"],
          next: "*",
        },
        {
          blankLine: "never",
          prev: "case",
          next: "multiline-block-like",
        },
        {
          blankLine: "always",
          prev: "multiline-block-like",
          next: "case",
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            "parent",
            ["sibling", "index"],
          ],
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "no-duplicate-imports": [
        "error",
        {
          includeExports: true,
        },
      ],
      "no-console": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@apollo/client",
              message: "Please use @apollo/client/index.js instead",
            },
          ],
        },
      ],
    },
  },
]
