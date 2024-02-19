---
sidebar_position: 100
---

# Porting Existing Game

Amazing that you're considering adapting your game for multiplayer on Rune! 🥳

We recommend you use the `rune-games-cli` to generate a game template and copy your game code into that game template. Following this approach will take care of any boilerplate and provide a nice development experience with Rune-specific ESLint & Vite plugins. You can also quickly get a minimal version of your game working, then add more game logic step-by-step. Alternatively, you can add the SDK manually.

### Approach 1: Rune Template

Create a new Rune game project by running:

```sh
npx rune-games-cli@latest create
```

You now have a simple example game with game logic and client rendering files. You can then copy your game logic and rendering code into the `logic.ts` and `client.ts` files respectively. Take a look at [Quick Start](../quick-start) for a quick introduction to these files or [Syncing Game State](./syncing-game-state) for a more in-depth explanation on the need for separation between logic and rendering.

We recommend that you enable ESLint in your editor to detect issues while developing your game. The template code already has the necessary configuration for ESLint.

### Approach 2: Manual Setup

1. Create a file called `logic.js` that has all [game logic](../quick-start#game-logic) and calls `Rune.initLogic()`
2. Create a file called `client.js` that's responsible for [rendering](../quick-start#rendering) and calls `Rune.initClient()`
3. Load the SDK and the two files mentioned above in your `index.html` in the following order:
```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer-dev.js"></script>
<script src="./logic.js"></script>
<script src="./client.js"></script>
```
4. Setup [Rune's ESLint plugin](../advanced/server-side-logic#editor-integration) to detect issues in your game logic

You can also look at the [Tic Tac Toe](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/tic-tac-toe) example game to understand how to set up a game manually. If you're using TypeScript, you will need to update your setup to export a `logic.js` file.

### Questions?

We're happy to help! Just write us on the [Rune Discord](https://discord.gg/rune-devs) server.
