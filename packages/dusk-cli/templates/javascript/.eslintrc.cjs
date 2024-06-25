module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:dusk/recommended",
  ],
  parserOptions: { sourceType: "module" },
}
