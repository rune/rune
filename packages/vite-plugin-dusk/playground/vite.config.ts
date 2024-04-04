import { defineConfig } from "vite"

// eslint-disable-next-line
// @ts-ignore
import dusk from "../src"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative
  plugins: [
    dusk({
      logicPath: path.resolve("./src/logic.ts"),
      minifyLogic: false, // This flag can be used if your logic reaches the allowed limit. However, it will make it significantly more difficult to detect validation issues
    }) as any, //Some kind of ts conflict between vite
  ],
})
