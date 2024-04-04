# vite-plugin-dusk

Plugin to use Dusk SDK with vite. This plugin will automatically inject the SDK and configure build options to create a `logic.js` file for the game. See [Syncing Game State](https://developers.dusk.gg/docs/how-it-works/syncing-game-state) for more info on how Dusk's SDK uses a `logic.js` file to seamlessly sync game state across players.

## Install

```shell
# yarn
yarn add --dev vite-plugin-dusk duske-games-sdk

# npm
npm install --dev vite-plugin-dusk dusk-games-sdk
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite"
import dusk from "vite-plugin-dusk"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dusk({ logicPath: "./src/logic.ts" })],
})
```

## License

MIT © Dusk 2024
