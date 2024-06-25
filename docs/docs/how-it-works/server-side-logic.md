---
sidebar_position: 60
---

# Server-Side Logic

Dusk uses a server-authoritative approach to ensure games run smoothly and prevent cheating. To do this, your game's `logic.js` file will run on every client and on Dusk's servers (see [Syncing Game State](../how-it-works/syncing-game-state) for more details). Dusk ensures that all players see the same thing when playing your game by having some limitations on what kind of code you can write in your `logic.js` file.

The primary aim is to ensure that the code is deterministic, meaning that if you run the code multiple times with the same input it will produce the same result. The main contributors to non-deterministic code in this context is use of other non-deterministic functions such as `Date.now()` and access of shared state such as counters and cache variables.

The Dusk SDK will help check your code for unsafe patterns such as:

- Mutation and assignment of variables outside of current function scope
- `async`/`await` syntax as logic must be synchronous
- `try`/`catch` syntax as this can interfere with  (throwing is still allowed)
- `eval` because it's potentially harmful and can be used to bypass other rules
- Non-deterministic runtime built-ins such as `Date` and `fetch`
- Regular expressions because they are stateful

A notable exception to this list is `Math.random()` which Dusk makes deterministic (see [Randomness](../advanced/randomness.md) for more info).

The [Dusk CLI](publishing/cli.md) will also warn you if it detects that your game logic seems to be using potentially unsafe code when uploading. Don't worry, we'll also help ensure that your game runs smoothly across devices when testing it before it's released.

## Why this approach using deterministic code? {#why-this-approach-using-deterministic-code}

Because it's the future! 😎 All modern multiplayer engines use predict-rollback netcode with deterministic physics. For instance, [Rocket League](https://www.youtube.com/watch?v=ueEmiDM94IE&t=1416s) and [Mortal Combat](https://www.youtube.com/watch?v=7jb0FOcImdg) both use this approach. It's how you make great multiplayer games that work even in bad network conditions.

Dusk's predict-rollback approach is extremely bandwidth-efficient as only the action payloads are sent between clients and server, not the entire game state. Clients can also simulate the world ahead of the server, which makes real-time games possible even on bad mobile internet with frequent latency spikes. This is all done by having the exact same deterministic game logic running on both the clients and the server.

## External Dependencies {#external-dependencies}

You can import external dependencies in your game logic, e.g. for physics or pathfinding. Many external libraries contain code that have unintended side effects and thus does not comply with constraints listed above. For that reason Dusk has a [list of known supported libraries](https://github.com/dusk-gg/dusk/blob/staging/packages/vite-plugin-dusk/src/dependency-whitelist.ts).

In case you use a library that's not on the supported libraries list, you'll receive a warning in CLI during development. If you build the game and successfully upload it to Dusk, we would appreciate if you add the dependencies to the list linked above.


## Editor Integration {#editor-integration}

Dusk has created an eslint plugin to give warnings for potentially unsafe code directly in your editor! If you're using the Dusk quickstart template created using `npx dusk-games-cli@latest create`, then this eslint plugin is already set up for you. If not, then follow the steps below.

First, install the Dusk eslint plugin:

```bash
npm install eslint-plugin-dusk --save-dev
```

Next, add the plugin to the extends section of your `.eslintrc` configuration file:

```json
{
  "extends": ["plugin:dusk/recommended"]
}
```

That's it. Your logic code will now be linted to detect potentially unsafe code and prevent desyncs! 🧙‍♂️

By default, the plugin will check files named `logic.js`/`logic.ts` or files in a `logic` folder for the Dusk SDK rules. If needed, you can specify more files to lint yourself with:

```json
{
  "overrides": [
    {
      "files": ["lib/*.ts"],
      "extends": ["plugin:dusk/logicModule"]
    }
  ]
}
```

You can also check out the [eslint plugin code](https://github.com/dusk-gg/dusk/tree/staging/packages/eslint-plugin-dusk).
