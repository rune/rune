---
sidebar_position: 100
---

# Setting up existing game

In case you are porting an existing game, there are two possible approaches:

1. Using the Rune game template and copying your code on top of it.
2. Adding Vite Rune plugin to an already existing vite project.
3. (Not recommended) Manual standalone setup.

## Using Rune game template.

Create a new Rune game project by running:

```sh
npx rune-games-cli@latest create
```

Select Plain TS template. This will take care of creating the relevant boilerplate for building the game, adding eslint rules, and creating example game logic and rendering files.

Now you just need to copy your game logic and rendering code into the `logic.js` and `client.js` files respectively.
Take a look at [game logic](../quick-start#game-logic) and [rendering](../quick-start#rendering).

## Adding Rune plugin to already existing vite project.

In case your game is already built using Vite, you can add the Rune plugin to it. See [Vite plugin](https://github.com/rune/rune-multiplayer-web-games/tree/staging/packages/vite-plugin-rune) for setup.
It is also recommended to setup [eslint](../advanced/server-side-logic#editor-integration) to detect errors in your game logic.

## (Not recommended) Manual standalone setup.

1. Add the SDK to the `index.html` above any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer-dev.js"></script>
```

2. Create a separate entry file called `logic.js` that is included below the SDK. This file should only contain the [game logic](../quick-start#game-logic).
```html
<script src="./logic.js"></script>
```

3. Your current game file should call `Rune.initClient` and be responsible for [rendering](../quick-start#rendering)

Your index.html should contain these lines in the following order:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer-dev.js"></script>
<script src="./logic.js"></script>
<script src="./client.js"></script>
```

4. Setup [eslint](../advanced/server-side-logic#editor-integration) to detect errors in your game logic.