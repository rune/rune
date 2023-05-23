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

const logicConfig: ESLint.ConfigData = {
  plugins: ["rune"],
  parserOptions: {
    ecmaVersion: 2021,
  },
  globals: {
    // See https://github.com/eslint/eslint/tree/main/conf/globals.js
    // commonjs
    exports: "off",
    global: "off",
    module: "off",
    require: "off",

    // es3
    Array: "readonly",
    Boolean: "readonly",
    // @ts-expect-error JS built-in method conflict
    constructor: "off",
    Date: "off",
    decodeURI: "off",
    decodeURIComponent: "off",
    encodeURI: "off",
    encodeURIComponent: "off",
    Error: "readonly",
    escape: "off",
    eval: "off",
    EvalError: "off",
    Function: "off",
    // @ts-expect-error JS built-in method conflict
    hasOwnProperty: "readonly",
    Infinity: "readonly",
    isFinite: "readonly",
    isNaN: "readonly",
    // @ts-expect-error JS built-in method conflict
    isPrototypeOf: "readonly",
    Math: "readonly",
    NaN: "readonly",
    Number: "readonly",
    Object: "readonly",
    parseFloat: "readonly",
    parseInt: "readonly",
    // @ts-expect-error JS built-in method conflict
    propertyIsEnumerable: "readonly",
    RangeError: "readonly",
    ReferenceError: "readonly",
    RegExp: "off",
    String: "readonly",
    SyntaxError: "readonly",
    // @ts-expect-error JS built-in method conflict
    toLocaleString: "off",
    // @ts-expect-error JS built-in method conflict
    toString: "readonly",
    TypeError: "readonly",
    undefined: "readonly",
    unescape: "off",
    URIError: "readonly",
    // @ts-expect-error JS built-in method conflict
    valueOf: "readonly",

    // es5
    JSON: "readonly",

    // es2015
    ArrayBuffer: "off",
    DataView: "off",
    Float32Array: "off",
    Float64Array: "off",
    Int16Array: "off",
    Int32Array: "off",
    Int8Array: "off",
    Map: "off",
    Promise: "off",
    Proxy: "off",
    Reflect: "off",
    Set: "off",
    Symbol: "off",
    Uint16Array: "off",
    Uint32Array: "off",
    Uint8Array: "off",
    Uint8ClampedArray: "off",
    WeakMap: "off",
    WeakSet: "off",

    // es2017
    Atomics: "off",
    SharedArrayBuffer: "off",

    // es2020
    BigInt: "off",
    BigInt64Array: "off",
    BigUint64Array: "off",
    globalThis: "off",

    // es2021
    AggregateError: "readonly",
    FinalizationRegistry: "off",
    WeakRef: "off",

    // Rune globals
    Rune: "readonly",
  },
  rules: {
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
    "rune/no-parent-scope-mutation": 2,
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
      Rune: true,
    },
    overrides: [
      {
        files: ["**/logic.js"],
        ...logicConfig,
      },
      {
        files: ["**/logic/**/*.ts", "**/logic/**/*.js"],
        ...logicModuleConfig,
      },
    ],
  },
  logic: logicConfig,
  logicModule: logicModuleConfig,
}
