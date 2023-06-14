"use strict"

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    node: true,
  },
  rules: {
    "prettier/prettier": ["error"],
  },
  overrides: [
    {
      files: ["packages/eslint-plugin-rune/**/*.js"],
      extends: ["plugin:eslint-plugin/recommended"],
    },
    {
      files: [
        "packages/eslint-plugin-rune/**/*.spec.js",
        "packages/eslint-plugin-rune/test/createConfigTester.js",
      ],
      env: { mocha: true },
    },
    {
      files: ["packages/eslint-plugin-rune/test/samples/*.js"],
      extends: ["plugin:rune/logic"],
    },
    {
      files: ["examples/**/*.js", "examples/**/*.ts"],
      extends: ["plugin:rune/recommended"],
      env: {
        browser: true,
      },
      globals: {
        Rune: "readonly", // TODO: this should be part of rune/recommended
      },
    },
    {
      files: ["docs/**/*.js"],
      parserOptions: {
        sourceType: "module",
      },
      plugins: ["react"],
      extends: ["plugin:react/recommended"],
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
    },
  ],
}
