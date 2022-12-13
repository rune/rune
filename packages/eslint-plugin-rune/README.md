# eslint-plugin-rune

This package is a collection of rules and configuration for writing safe logic code for the Rune Multiplayer SDK.

The primary aim is to ensure that the code is deterministic, meaning that if you run the code multiple times with the same input it will produce the same result. The main contributors to non-deterministic code in this context is use of other non-deterministic functions such as `Math.random()`/`Date.now()` and access of shared state such as counters and cache variables. Therefore this config:

- **Bans mutation and assignment of variables outside of current function scope**. Since mutation of function arguments are allowed for ergonomic reasons, it's also not allowed to read non-local variables, just invoking functions/methods.
- **Bans async/await syntax** as the SDK requires logic to be synchronous.
- **Bans try/catch syntax** as this might interfere with Rune game control flow. Throwing is still allowed in case your program hits an irrecoverable error state.
- **Bans non-deterministic runtime built-ins** such as `Math.random`, `Date`, `fetch` etc.
- **Bans modules** such as `import/export` and `require` as the SDK requires your logic to be self-contained in a single file. If you want to share logic or split the file into multiple you may use a bundler like rollup to produce a single file from many.
- **Bans non-serializable data types** such as `Set`, `Map`, `Promise` etc because the game state needs to be able to be represented as `JSON`.
- **Bans regular expressions** because they are stateful.
- **Bans `eval`** because it's potentially harmful and can be used to bypass above rules.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-rune`:

```sh
npm install eslint-plugin-rune --save-dev
```

## Usage

Add `rune` to the extends section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "extends": ["plugin:rune/recommended"]
}
```

This will exclusively check files named `logic.js` for the Rune Multiplayer SDK rules. If your logic is split across multiple files and a bundler is used to produce a single file, you might specify which files to lint yourself with:

```json
{
  "overrides": [
    {
      "files": ["logic/*.js"],
      "extends": ["plugin:rune/logic"]
    }
  ]
}
```

## Contributing

We'd love to get your feedback these rules! Do let us know if you feel like some of our rules are excessively restrictive, or miss unsafe code. You can submit either an issue where you describe the code you want to run and why it's safe/unsafe _OR_ a pull request where we ask for both valid and invalid test cases.

## License

MIT © Rune AI Inc. 2022
