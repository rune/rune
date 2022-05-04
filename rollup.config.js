// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import replace from "@rollup/plugin-replace"
import { terser } from "rollup-plugin-terser"

export default [
  {
    input: "src/browser.ts",
    output: {
      file: "dist/browser.js",
      format: "iife",
      name: "Rune",
    },
    plugins: [
      replace({
        preventAssignment: true,
        delimiters: ["", ""],
        values: {
          globalThis: "window",
        },
      }),
      typescript({ tsconfig: "./tsconfig.browser.json" }),
      terser({ format: { comments: false } }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      sourcemap: true,
      format: "es",
      file: "dist/index.js",
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
]
