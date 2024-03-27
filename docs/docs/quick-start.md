---
sidebar_position: 0
---

# Quick Start

Build a multiplayer game for the [Rune platform](https://www.rune.ai) and its millions of players. Rune handles netcode, servers, voice chat, matchmaking, spectating, and much more!

## Getting started {#getting-started}

### New game {#new-game}

Creating a new game on Rune requires only one command!

```sh
npx rune-games-cli@latest create
```

After it finishes, you'll have a running tic tac toe game inside the [dev ui](./publishing/simulating-multiplayer).

### Existing game {#existing-game}

Already have a great game that you want to add to Rune? Follow the [guide to port your existing game to Rune](./how-it-works/existing-game.md). 

## Testing the game in the app {#playing-the-game-in-app}

Now that you have your game running locally, it would be great to see how it looks in the Rune app.
Run:

```sh
npm run upload
```
This is it! After doing this you should see your game in the games list inside the app. Start the room, invite your friends and play together!

## How it all works {#how-it-all-works}

Rune games are split into two parts: logic & rendering.
Let's take a look at the generated tic tac toe game and get familiar with it. You can also deep dive into in depth explanation in [syncing game state docs](how-it-works/syncing-game-state.md). 

### Game Logic {#game-logic}

You can find the game logic in `logic.js` file.

The `setup` function is responsible for creating an initial game state that is synced across players:

```js
function setup() {
  return  {
    cells: new Array(9).fill(null), // 3x3 cell grid
    lastMovePlayerId: null,
    //...rest of the state
  }
}
```

To modify the game state that is synced between players, we define actions that get called from game rendering part:

```js
function claimCell(cellIndex, { game, playerId }) {
  //Do not allow to claim cell if it is already claimed or if it is not player's turn
  if (game.cells[cellIndex] !== null || playerId === game.lastMovePlayerId) {
    throw Rune.invalidAction()
  }

  game.cells[cellIndex] = playerId
  game.lastMovePlayerId = playerId
  
  //...Rest of the logic, like checking for win condition
}
```

Finally we provide setup function, actions, and other game information to `Rune.initLogic`:

```js
Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup,
  actions: {
    claimCell,
  },
})
```
Other `initLogic` options are described in [API game logic reference](api-reference.md#game-logic).


### Rendering {#rendering}

You can find your game rendering code in `client.js` file.

Game rendering is responsible for reacting to game state changes:

```js
function onChange({ game, players, yourPlayerId, action }) {
  const { cells, lastMovePlayerId } = game

  // ...Update your game visuals according to latest received game state. Also play sound effects, update styles, etc.
}

Rune.initClient({ onChange })
```

Game rendering is also responsible for handling user input by calling actions:

```js
const button = //... get the cell
button.addEventListener("click", () => Rune.actions.claimCell(cellIndex))
```

You can find additional information about [rendering here](how-it-works/syncing-game-state.md#rendering).

## What to do next? {#next-steps}

- If you want some inspiration for your next game, we really recommend [checking out example games](examples.mdx)!
- Building games is more fun when you are a part of community, [join Rune Discord server](https://discord.gg/rune-devs).
- If your game is ready to be published for all Rune users, check out [publishing your game](publishing/publishing-your-game.md).
- Want to know everything that Rune supports? [Explore the API reference](api-reference.md).
