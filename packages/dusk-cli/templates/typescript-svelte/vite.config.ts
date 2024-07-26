import { svelte } from "@sveltejs/vite-plugin-svelte"
import dusk from "dusk-games-sdk/vite"
import path from "node:path"
import { defineConfig } from "vite"
import { qrcode } from "vite-plugin-qrcode"

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative
  plugins: [
    qrcode(), // only applies in dev mode
    svelte(),
    dusk({
      logicPath: path.resolve("./src/logic.ts"),
      minifyLogic: false, // This flag can be used if your logic reaches the allowed limit. However, it will make it significantly more difficult to detect validation issues
      ignoredDependencies: [],
    }),
  ],
})
