# vite-plugin-rune

Plugin to use Rune Multiplayer SDK with vite. Will automatically inject the SDK and configure build options according to the Rune [logic.js requirements](https://developers.rune.ai/docs/advanced/server-side-logic).

## Install

```shell
# yarn
yarn add --dev vite-plugin-rune rune-games-sdk

# npm
npm install --dev vite-plugin-rune rune-games-sdk
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite"
import rune from "vite-plugin-rune"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [rune({ logicPath: "./src/logic.ts" })],
})
```

## License

MIT © Rune AI Inc. 2023
