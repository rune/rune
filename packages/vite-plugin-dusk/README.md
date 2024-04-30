# vite-plugin-dusk

Plugin to use Dusk SDK with Vite. This plugin automatically creates a `logic.js` file for the game to simplify your build setup. See [Syncing Game State](https://developers.dusk.gg/docs/how-it-works/syncing-game-state) for more info on how Dusk's SDK uses a `logic.js` file to seamlessly sync game state across players.

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

## Which SDK version does this plugin use?

The Vite plugin uses the local SDK version that you've installed through npm/yarn. To update your SDK version, you just update it as normal.

## License

MIT © Dusk 2024
