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

## Why this approach using deterministic code? {#why-this-approach-using-deterministic-code}

Because it's the future! 😎 All modern multiplayer engines use predict-rollback netcode with deterministic physics. For instance, [Rocket League](https://www.youtube.com/watch?v=ueEmiDM94IE&t=1416s), [Overwatch](https://www.youtube.com/watch?v=zrIY0eIyqmI), and [Mortal Combat](https://www.youtube.com/watch?v=7jb0FOcImdg) all use this approach. It's how you make great multiplayer games that work even in bad network conditions.

Rune's predict-rollback approach is extremely bandwidth-efficient as only the action payloads are sent between clients and server, not the entire game state. Clients can also simulate the world ahead of the server, which makes real-time games possible even on bad mobile internet with frequent latency spikes. This is all done by having the exact same deterministic game logic running on both the clients and the server.

## External dependencies {#external-dependencies}

You can import external dependencies in your game logic.

Many external libraries contain code that does not comply with constraints listed above. For that reason Rune has a whitelist of allowed libraries.

In case you use a library that is not part of the whitelist, you'll receive a warning in CLI during development.
If you build the game and successfully upload it to Rune, you can add used dependencies to the whitelist by contributing to [Vite Plugin Rune](https://github.com/rune/rune-multiplayer-web-games/blob/staging/packages/vite-plugin-rune/src/dependency-whitelist.ts).


## Editor Integration {#editor-integration}

Rune has created an eslint plugin to give warnings for potentially unsafe code directly in your editor! If you're using the Rune quickstart template created using `npx rune-games-cli@latest create`, then this eslint plugin is already set up for you. If not, then follow the steps below.

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

That's it. Your logic code will now be linted to detect potentially unsafe code and prevent desyncs! 🧙‍♂️

By default, the plugin will check files named `logic.js`/`logic.ts` or files in a `logic` folder for the Rune SDK rules. If needed, you can specify more files to lint yourself with:

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

You can also check out the [eslint plugin code](https://github.com/rune/rune/tree/staging/packages/eslint-plugin-rune).
