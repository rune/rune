module.exports = {
  root: true,
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "prettier"],
  plugins: ["@typescript-eslint"],
  rules: {
    "no-throw-literal": "error",

    // Used to inject into global space
    "no-undef": "off",
    "no-unused-vars": "off",

    // Used to improve developer experience
    "no-console": "off"
  },
  settings: {},
  globals: {
    console: "readonly",
    exports: "readonly",
    module: "readonly",
    process: "readonly",
    Promise: "readonly",
    require: "readonly",
    setTimeout: "readonly",
  },
}
