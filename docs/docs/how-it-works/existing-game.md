---
sidebar_position: 100
---

# Setting up existing game

In case you are porting an existing game to Rune you can use the `rune-games-cli` to generate the game template and copy your code on top of it or use a manual standalone setup.
We strongly recommend to go with the first approach, as it will take care of all the necessary boilerplate out of the box & provide a better development experience.

## Using Rune game template.

Create a new Rune game project by running:

```sh
npx rune-games-cli@latest create
```

Select Plain TS template. This will take care of creating the relevant boilerplate for building the game and provides simple example game logic and rendering files.

Now you just need to copy your game logic and rendering code into the `logic.js` and `client.js` files respectively.
Take a look at [game logic](../quick-start#game-logic) and [rendering](../quick-start#rendering).

We also recommend to enable Eslint in your editor to detect issues while developing your game. The template code already has the necessary configuration for Eslint.

## Manual standalone setup.

1. Add the SDK to the `index.html` above any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer-dev.js"></script>
```

2. Create a separate entry file called `logic.js` that is included below the SDK. This file should only contain the [game logic](../quick-start#game-logic).
```html
<script src="./logic.js"></script>
```

3. Create a separate entry file called `client.js`. This file will call `Rune.initClient` and be responsible for [rendering](../quick-start#rendering)

Your index.html should contain these lines in the following order:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer-dev.js"></script>
<script src="./logic.js"></script>
<script src="./client.js"></script>
```

4. Setup [eslint](../advanced/server-side-logic#editor-integration) to detect errors in your game logic.

You can also look into [Tic Tac Toe](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/tic-tac-toe) as example to understand how to setup a game manually.
