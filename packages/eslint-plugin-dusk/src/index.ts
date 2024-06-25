import type { ESLint } from "eslint"

export { rules } from "./rules"

const restrictedSyntaxBase = [
  {
    selector: "TryStatement",
    message: "Try/catch might prevent Dusk from working properly.",
  },
  {
    selector: "ThisExpression,WithStatement",
    message: "This references might prevent Dusk from working properly.",
  },
  {
    selector:
      "AwaitExpression,ArrowFunctionExpression[async=true],FunctionExpression[async=true],FunctionDeclaration[async=true],YieldExpression",
    message: "Dusk logic must be synchronous.",
  },
  {
    selector: "RegExpLiteral",
    message:
      "Regular expressions are stateful and might prevent Dusk from working properly.",
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
    message:
      "Use Dusk.gameTime() instead, which keeps time synchronized across players.",
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
  plugins: ["dusk"],
  parserOptions: {
    ecmaVersion: 2021,
  },
  globals: {
    globalThis: "readonly",
    global: "readonly",
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
        object: "Dusk",
        property: "init",
        message: "Dusk.init() is restricted to client-only code.",
      },
      {
        object: "Dusk",
        property: "initClient",
        message: "Dusk.init() is restricted to client-only code.",
      },
      {
        object: "Dusk",
        property: "deterministicRandom",
        message: "Dusk.init() is restricted to client-only code.",
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "ImportDeclaration,ExportNamedDeclaration[source],ExportAllDeclaration[source],ExportDefaultDeclaration[source]",
        message: "Dusk logic must be contained in a single file.",
      },
      ...restrictedSyntaxBase,
    ],
    "dusk/no-global-scope-mutation": 2,
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
