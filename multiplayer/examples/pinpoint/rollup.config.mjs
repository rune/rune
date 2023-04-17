import typescript from "@rollup/plugin-typescript"
import stripExports from "rollup-plugin-strip-exports"

export default [
  {
    input: "src/logic/logic.ts",
    output: { file: "public/logic.js", format: "es" },
    plugins: [
      typescript({ tsconfig: "./tsconfig-logic.json" }),
      stripExports(),
    ],
  },
]
