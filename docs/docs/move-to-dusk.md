---
sidebar_position: 20
---

# Moving from Rune to Dusk

:::tip

**TLDR**: Use `npx dusk-cli@latest rune-to-dusk` to automatically update your game from Rune to Dusk.

:::

Rune was the name previously used for the SDK and service. Your current projects should be updated to use the newer renamed versions of the Games SDK, tools and configuration files.  

# Automated Conversion


If you used one of the templates when you created your game then you can use `npx dusk-cli@latest rune-to-dusk` to automatically update your game from Rune to Dusk.

# Manual Conversion

If you've built your game without a Dusk template then follow the next sections to update your project.

## Module Dependencies

Dusk comes with a set of updated modules. In your `package.json` update the following:

| *old module*         | *new module*         |
|----------------------|----------------------|
| `rune-games-sdk`     | `dusk-games-sdk`     |
| `eslint-plugin-rune` | `eslint-plugin-dusk` |
| `vite-plugin-rune`   | `vite-plugin-dusk`   |

## Updating the Code

All references to Rune based API should be updated to Dusk. For instance `RuneClient` becomes `DuskClient`, `Rune.initLogic` becomes `Dusk.initLogic` and the SDK itself
goes from `rune-games-sdk` to `dusk-games-sdk`.

If you're including the SDK directly in your index.html file then the URL to the SDK should also be updated from `rune-games-sdk` to 
`dusk-games-sdk`.

You can also check out the [example games](/docs/examples) which have already been migrated.

## Get the new CLI

To get the latest CLI you can use the follow to install them globally:

`yarn global add dusk-cli@latest` or `npm install -g dusk-cli@latest`

Remember, the command to use the CLI is now `dusk`

## ESLint Configuration

If you were previously using the Rune es-lint plugin then your configuration file will need
to be updated to make use of the latest Dusk plugin.

Replace `plugin:rune/recommended` with `plugin:dusk/recommended`

## Vite Configuration

If you were previously using the Rune Vite plugin then your configuration file will need 
to be updated to make use of the latest Dusk plugin.

Change the import to the new dependency:

`import dusk from "vite-plugin-dusk"`

and update the plugin list to replace:

`rune({ logicPath: path.resolve("./src/logic.ts") })`

with 

`dusk({ logicPath: path.resolve("./src/logic.ts") })`
