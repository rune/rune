import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import nodeResolve from "@rollup/plugin-node-resolve"
export default {
  input: "tmp/index.js",
  output: {
    file: "dist/index.js",
  },
  plugins: [nodeResolve({ preferBuiltins: true }), commonjs(), json()],
}
