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
    rune({
      logicPath: path.resolve("./src/logic.ts"),
      enableLogicMinification: false, // If your logic reaches the allowed limit, you can enable this flag to minify it. This will make it significantly more difficult to detect validation issues.
    }),
  ],
})
