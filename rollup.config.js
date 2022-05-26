// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import replace from "@rollup/plugin-replace"
import { terser } from "rollup-plugin-terser"
import { nodeResolve } from "@rollup/plugin-node-resolve"

export default [
  // Build config used by game devs to include in index file
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
      // Remove comments
      terser({ format: { comments: false } }),
      // Allow to import packages from node_modules
      nodeResolve(),
    ],
  },
  // Build used to expose Rune SDK as node module
  {
    input: "src/index.ts",
    output: {
      sourcemap: true,
      format: "es",
      file: "dist/index.js",
    },
    // Do not inline xstate
    external: ["xstate"],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
  // Build used to expose helper messages for communication with clients
  {
    input: "src/internal/api.ts",
    output: {
      sourcemap: true,
      format: "cjs", // Common js format to easily support node env
      file: "dist/internal/api.js",
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
]
