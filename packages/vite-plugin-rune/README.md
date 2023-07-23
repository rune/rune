# vite-plugin-rune

Plugin to use Rune SDK with vite. This plugin will automatically inject the SDK and configure build options to create a `logic.js` file for the game. See [Syncing Game State](https://developers.rune.ai/docs/how-it-works/syncing-game-state) for more info on how Rune's SDK uses a `logic.js` file to seamlessly sync game state across players.

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
