module.exports = {
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
    "no-console": ["warn"],
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
