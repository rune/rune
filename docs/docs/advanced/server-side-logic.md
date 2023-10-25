---
sidebar_position: 60
---

# Server-Side Logic

Rune uses a server-authoritative approach to ensure games run smoothly and prevent cheating. To do this, your game's `logic.js` file will run on every client and on Rune's servers (see [Syncing Game State](../how-it-works/syncing-game-state) for more details). Rune ensures that all players see the same thing when playing your game by having some limitations on what kind of code you can write in your `logic.js` file.

The primary aim is to ensure that the code is deterministic, meaning that if you run the code multiple times with the same input it will produce the same result. The main contributors to non-deterministic code in this context is use of other non-deterministic functions such as `Date.now()` and access of shared state such as counters and cache variables.

The Rune SDK will help check your code for unsafe patterns such as:

- Mutation and assignment of variables outside of current function scope
- `async`/`await` syntax as logic must be synchronous
- `try`/`catch` syntax as this can interfere with  (throwing is still allowed)
- `eval` because it's potentially harmful and can be used to bypass other rules
- Non-deterministic runtime built-ins such as `Date` and `fetch`
- Regular expressions because they are stateful

A notable exception to this list is `Math.random()` which Rune makes deterministic (see [Randomness](randomness.md) for more info).

The [Rune CLI](publishing/cli.md) will also warn you if it detects that your game logic seems to be using potentially unsafe code when uploading. Don't worry, we'll also help ensure that your game runs smoothly across devices when testing it before it's released.

## Why this approach using deterministic code?

Because it's the future! 😎 All modern multiplayer engines use predict-rollback netcode with deterministic physics. For instance, [Coherence](https://coherence.io) and [Photon Quantum](https://www.photonengine.com/quantum) for Unity and the [rollback plugin](https://gitlab.com/snopek-games/godot-rollback-netcode) for Godot. It's how you make great multiplayer games that work even in bad network conditions.

Rune's predict-rollback approach is extremely bandwidth-efficient as only the action payloads are sent between clients and server, not the entire game state. Clients can also simulate the world ahead of the server, which makes real-time games possible even on bad mobile internet with frequent latency spikes.

## Editor Integration

If you use [ESLint](https://eslint.org/), you can get warnings for potentially unsafe code directly in your editor!

First, install the Rune eslint plugin:

```bash
npm install eslint-plugin-rune --save-dev
```

Next, add the plugin to the extends section of your `.eslintrc` configuration file:

```json
{
  "extends": ["plugin:rune/recommended"]
}
```

The Rune eslint plugin will by default check files named `logic.js`/`logic.ts` or files in a `logic` folder for the Rune SDK rules. If needed, you can specify more files to lint yourself with:

```json
{
  "overrides": [
    {
      "files": ["lib/*.ts"],
      "extends": ["plugin:rune/logicModule"]
    }
  ]
}
```
