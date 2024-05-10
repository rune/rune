import type { ESLint } from "eslint"

export { rules } from "./rules"

const restrictedSyntaxBase = [
  {
    selector: "TryStatement",
    message: "Try/catch might prevent Rune from working properly.",
  },
  {
    selector: "ThisExpression,WithStatement",
    message: "This references might prevent Rune from working properly.",
  },
  {
    selector:
      "AwaitExpression,ArrowFunctionExpression[async=true],FunctionExpression[async=true],FunctionDeclaration[async=true],YieldExpression",
    message: "Rune logic must be synchronous.",
  },
  {
    selector: "RegExpLiteral",
    message:
      "Regular expressions are stateful and might prevent Rune from working properly.",
  },
]

const restrictedGlobals = [
  "exports",
  "module",
  "require",
  "window",
  "global",
  "constructor",
  {
    name: "Date",
    message: "Please use Rune.gameTime() for time.",
  },
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "eval",
  "EvalError",
  "Function",
  "RegExp",
  "toLocaleString",
  "unescape",
  "ArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int16Array",
  "Int32Array",
  "Int8Array",
  "Promise",
  "Proxy",
  "Reflect",
  "Symbol",
  "Uint16Array",
  "Uint32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "WeakMap",
  "WeakSet",
  "Atomics",
  "SharedArrayBuffer",
  "BigInt",
  "BigInt64Array",
  "BigUint64Array",
  "FinalizationRegistry",
  "WeakRef",
  "Performance",
  "Intl",
]

const logicConfig: ESLint.ConfigData = {
  // https://github.com/eslint/eslint/issues/7984#issuecomment-275409556
  env: { es6: true },
  plugins: ["rune"],
  parserOptions: {
    ecmaVersion: 2021,
  },
  globals: {
    globalThis: "readonly",
    global: "readonly",
    Rune: "readonly",
    Dusk: "readonly",
    console: "readonly",
  },
  rules: {
    "no-restricted-globals": ["error", ...restrictedGlobals],
    "no-undef": 2,
    "no-global-assign": 2,
    "no-extend-native": 2,
    "no-var": 1,
    "no-restricted-properties": [
      2,
      {
        object: "Rune",
        property: "init",
        message: "Rune.init() is restricted to client-only code.",
      },
      {
        object: "Rune",
        property: "initClient",
        message: "Rune.init() is restricted to client-only code.",
      },
      {
        object: "Rune",
        property: "deterministicRandom",
        message: "Rune.init() is restricted to client-only code.",
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "ImportDeclaration,ExportNamedDeclaration[source],ExportAllDeclaration[source],ExportDefaultDeclaration[source]",
        message: "Rune logic must be contained in a single file.",
      },
      ...restrictedSyntaxBase,
    ],
    "rune/no-global-scope-mutation": 2,
  },
}

const logicModuleConfig: ESLint.ConfigData = {
  ...logicConfig,
  rules: {
    ...logicConfig.rules,
    "no-restricted-syntax": ["error", ...restrictedSyntaxBase],
  },
}

export const configs: ESLint.Plugin["configs"] = {
  recommended: {
    globals: {
      Rune: "readonly",
      Dusk: "readonly",
    },
    overrides: [
      {
        files: ["**/logic.ts", "**/logic.js"],
        ...logicModuleConfig,
      },
    ],
  },
  logic: logicConfig,
  logicModule: logicModuleConfig,
}
