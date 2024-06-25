import { defineConfig } from "vite"
import rune from "vite-plugin-rune"

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative, so that the game can be hosted on developers.dusk.gg
  plugins: [rune({ logicPath: "./src/logic/logic.ts" })],
})
