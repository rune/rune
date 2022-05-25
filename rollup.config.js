// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import replace from "@rollup/plugin-replace"
import { terser } from "rollup-plugin-terser"
import { nodeResolve } from "@rollup/plugin-node-resolve"

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
          "process.env.NODE_ENV": JSON.stringify("production"),
          globalThis: "window",
        },
      }),
      typescript({ tsconfig: "./tsconfig.browser.json" }),
      terser({ format: { comments: false } }),
      nodeResolve(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      sourcemap: true,
      format: "es",
      file: "dist/index.js",
    },
    external: ["xstate"],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
  {
    input: "src/api.ts",
    output: {
      sourcemap: true,
      format: "es",
      file: "dist/api.js",
    },
    external: ["xstate"],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
]
