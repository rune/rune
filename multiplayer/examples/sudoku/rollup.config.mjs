import typescript from "@rollup/plugin-typescript"

export default [
  {
    input: "src/logic/logic.ts",
    output: { file: "public/logic.js", format: "es" },
    plugins: [typescript({ tsconfig: "./tsconfig-logic.json" })],
  },
]
