import { defineConfig } from "vite"
import rune from "vite-plugin-rune"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [rune({ logicPath: "./src/logic/index.ts" })],
})
