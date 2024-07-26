import { defineConfig } from "vite"
import dusk from "dusk-games-sdk/vite"

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative, so that the game can be hosted on developers.dusk.gg
  plugins: [dusk({ logicPath: "./src/logic/logic.ts" })],
})
