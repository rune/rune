module.exports = {
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:dusk/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
}