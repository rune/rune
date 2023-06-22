---
sidebar_position: 100
---

# Server-Side Logic

Rune uses a server-authoritative approach to ensure games run smoothly and prevent cheating. To do this, your game's `logic.js` file will run on every client and on Rune's servers (see [Syncing Game State](docs/multiplayer/syncing-game-state) for more details). Rune ensures that all players see the same thing when playing your game by having some limitations on what kind of code you can write in your `logic.js` file.

The primary aim is to ensure that the code is deterministic, meaning that if you run the code multiple times with the same input it will produce the same result. The main contributors to non-deterministic code in this context is use of other non-deterministic functions such as `Date.now()` and access of shared state such as counters and cache variables. **To avoid errors in production the Rune Multiplayer SDK will check your code** for the following unsafe patterns:

- **Mutation and assignment of variables outside of current function scope**. Since mutation of function arguments are allowed for ergonomic reasons, it's also not allowed to read non-local variables, just invoking functions/methods.
- **`async`/`await` syntax** as logic must be synchronous.
- **`try`/`catch` syntax** as this might interfere with Rune game control flow. Throwing is still allowed in case your program hits an irrecoverable error state.
- **Use of non-deterministic runtime built-ins** such as `Date`, `fetch` etc.
- **Modules** such as `import/export` and `require` as the SDK requires your logic to be self-contained in a single file. If you want to share logic or split the file into multiple you may use a bundler like rollup to produce a single file from many.
- **Regular expressions** because they are stateful.
- **Use of `eval`** because it's potentially harmful and can be used to bypass above rules.

A notable exception to this list is `Math.random()` which is ensured to be deterministic, see [Randomness](randomness.md) to read more about how this works.

The [Rune CLI](publishing/cli.md) will warn you if your game logic uses unsafe code so don't worry!

## Editor Integration

If you use [ESLint](https://eslint.org/) as part of your development setup, it's also possible to get these warnings directly in your editor.

First, install `eslint-plugin-rune`:

```bash
npm install eslint-plugin-rune --save-dev
```

Next, add `rune` to the extends section of your `.eslintrc` configuration file:

```json
{
  "extends": ["plugin:rune/recommended"]
}
```

This will exclusively check files named `logic.js`/`logic.ts` or files in a `logic` folder for the Rune Multiplayer SDK rules. If your logic is split across multiple files and a bundler is used to produce a single file, you might specify which files to lint yourself with:

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
