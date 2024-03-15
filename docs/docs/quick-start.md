---
sidebar_position: 0
---

# Quick Start

Build a multiplayer game for the [Rune platform](https://www.rune.ai) and its millions of players. Rune handles netcode, servers, voice chat, matchmaking, spectating, and much more.

## Install {#install}

Create a new Rune game project by running:

```sh
npx rune-games-cli@latest create
```

or follow this [guide to port your existing game](./how-it-works/existing-game.md) to Rune.

That's it!

`rune-games-cli@latest` to see the game inside the Rune app!

Or read on for a short explainer of how Rune is separated into game logic and rendering (...)


## Game Logic {#game-logic}



(...) `setup` function that returns initial values for your `game` state that should be [synced across players](how-it-works/syncing-game-state.md) (...)

```js
function setup(allPlayerIds) {
    const game = { cells: new Array(9).fill(null) }
    return game
}
```

You modify `game` state via actions (...)

```js
function claimCell(cellIndex, { game, playerId }) {
    
    // Don't allow overwriting 
    if (game.cells[cellIndex] !== null || playerId === game.lastMovePlayerId) {
        throw Rune.invalidAction()
    }

    // Fill cell and switch turn
    game.cells[cellIndex] = playerId
    game.lastMovePlayerId = playerId
}
```

(...)

```js
Rune.initLogic()
```

## Rendering {#rendering}

Your game UI is integrated to [react to game state changes](api-reference.md#runeinitclientoptions) via the `onChange` callback (...).

Emit actions

```js
// Callback you define for when something changes (e.g. someone made an action)
function onChange({ game, yourPlayerId, players, action, event }) {
  // Your game visuals update code...
}

// Initialize the Rune SDK once your game is fully ready
Rune.initClient({ onChange })
```

## Uploading {#uploading}

(...) `rune upload`

## Next Steps {#next-steps}

- [View example games](examples.mdx)
- [Read more about game state syncing](how-it-works/syncing-game-state.md)
- [Publish your game](publishing/publishing-your-game.md)
- [Explore the API reference](api-reference.md)
- [Join the Rune Discord server](https://discord.gg/rune-devs)
