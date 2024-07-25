---
sidebar_position: 20
---

# Moving from Rune to Dusk

Rune is changing name to Dusk communicates to the world that we'll now focus 100% on building an amazing multiplayer games platform! As part of this, we've renamed Rune SDK/CLI have been renamed to Dusk SDK/CLI. We've worked hard to make the migration super simple for you.

# Approach 1 - Automated Conversion (recommended)

This easiest way is to run `npx dusk-cli@latest rune-to-dusk` to automatically update your game from Rune to Dusk. This definitely works if you used one of the Rune templates when you created your game and may also work if you haven't. So it's good to try this approach first.

:::tip

**TLDR**: Use `npx dusk-cli@latest rune-to-dusk` to automatically update your game from Rune to Dusk.

:::

# Approach 2 - Manual Conversion

If the migration script doesn't work, then follow the next sections to update your project.

### Module Dependencies

Dusk comes with a set of updated modules. In your `package.json` update the following:

| *old module*         | *new module*         |
|----------------------|----------------------|
| `rune-games-sdk`     | `dusk-games-sdk`     |
| `eslint-plugin-rune` | `eslint-plugin-dusk` |
| `vite-plugin-rune`   | `vite-plugin-dusk`   |

### Updating the Code

All references to Rune based API should be updated to Dusk. For instance `RuneClient` becomes `DuskClient`, `Rune.initLogic` becomes `Dusk.initLogic` and the SDK itself
goes from `rune-games-sdk` to `dusk-games-sdk`.

If you're including the SDK directly in your index.html file then the URL to the SDK should also be updated from `rune-games-sdk` to 
`dusk-games-sdk`.

You can also check out the [example games](/docs/examples/games) which have already been migrated.

### Get the new CLI

To get the latest CLI you can use the follow to install them globally:

`yarn global add dusk-cli@latest` or `npm install -g dusk-cli@latest`

Remember, the command to use the CLI is now `dusk`.

### ESLint Configuration

If you were previously using the Rune eslint plugin then your configuration file should be updated to use the latest Dusk plugin:

1. Replace `plugin:rune/recommended` with `plugin:dusk/recommended`

### Vite Configuration

If you were previously using the Rune Vite plugin then your vite configuration file will need to be updated to make use of the latest Dusk plugin:

1. Change the import to the new dependency `import dusk from "vite-plugin-dusk"`
2. Update the plugin list to replace `rune({ logicPath: path.resolve("./src/logic.ts") })` with `dusk({ logicPath: path.resolve("./src/logic.ts") })`

### Questions?

We're happy to help! Just write us on the [Dusk Discord](https://discord.gg/dusk-devs) server.
