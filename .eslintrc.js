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
    browser: true,
  },
  rules: {
    "prettier/prettier": ["error"],
  },
  overrides: [
    {
      files: ["packages/eslint-plugin-dusk/**/*.js"],
      extends: ["plugin:eslint-plugin/recommended"],
    },
    {
      files: [
        "packages/eslint-plugin-dusk/**/*.spec.js",
        "packages/eslint-plugin-dusk/test/createConfigTester.js",
      ],
      env: { mocha: true },
    },
    {
      files: ["packages/eslint-plugin-dusk/test/samples/*.js"],
      extends: ["plugin:dusk/logic"],
    },
    {
      files: ["examples/**/*.js", "examples/**/*.ts"],
      extends: ["plugin:dusk/recommended"],
      env: {
        browser: true,
      },
      globals: {
        Dusk: "readonly", // TODO: this should be part of dusk/recommended
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
