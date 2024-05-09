import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'node:path';
import rune from 'vite-plugin-rune';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), rune({ logicPath: path.resolve("./src/logic.ts") })],
})
