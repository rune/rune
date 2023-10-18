import { defineConfig } from "vite"
import { qrcode } from "vite-plugin-qrcode"
import react from "@vitejs/plugin-react"
import rune from "vite-plugin-rune"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative
  plugins: [
    qrcode(), // only applies in dev mode
    react(),
    rune({ logicPath: path.resolve("./src/logic.ts") }),
  ],
})
