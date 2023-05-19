import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import rune from "vite-plugin-rune"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), rune({ logicPath: "./src/logic.ts" })],
})
