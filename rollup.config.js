// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import replace from "@rollup/plugin-replace"
import { terser } from "rollup-plugin-terser"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import injectProcessEnv from "rollup-plugin-inject-process-env"

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
      injectProcessEnv({
        NODE_ENV: "production",
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
]
