import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default [
  {
    input: "src/logic.ts",
    watch: false,
    output: { file: "build/logic.js", format: "es" },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig-logic.json" }),
    ],
  },
  {
    input: "src/logic.ts",
    watch: true,
    output: { file: "public/logic.js", format: "es" },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig-logic.json" }),
    ],
  },
]
