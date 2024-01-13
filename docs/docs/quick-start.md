---
sidebar_position: 0
---

# Quick Start

Build a multiplayer game for the [Rune platform](https://www.rune.ai) and its millions of players. Rune handles netcode, servers, voice chat, matchmaking, spectating, and much more.

## Install

Create a new Rune game project by running: 

```sh
npx rune-games-cli@latest create
```

or add the SDK to an existing game by including it in your `index.html` above any other JS scripts: 

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer-dev.js"></script>
```

## Game Logic

Create a file named `logic.js` with a `setup` function that returns initial values for your `game` state that should be [synced across players](how-it-works/syncing-game-state.md). Add an action that modifies this `game` state and call `Rune.initLogic()` to initialize. For instance, to give all players a score and have an action that just increments the score:

```js
// logic.js

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const game = { scores: {} }
    for (let playerId of allPlayerIds) {
      game.scores[playerId] = 0
    }
    return game
  },
  actions: {
    incrementScore(playerWhoGotPoints, { game }) {
      game.scores[playerWhoGotPoints]++
    },
  },
})
```

## Rendering

Next, integrate your game UI to [react to game state changes](api-reference.md#runeinitclientoptions) and [send actions to the logic layer](api-reference.md#runeinitclientoptions). This code may live anywhere except in `logic.js`; the docs will refer to `client.js`:

```js
// client.js

// Your game setup code...

// Trigger an action based on user input
button.onClick = () => {
  Rune.actions.incrementScore({
    playerWhoGotPoints: "player1",
  })
}

// Callback you define for when something changes (e.g. someone made an action)
function onChange({ game, yourPlayerId, players, action, event }) {
  // Your game visuals update code...
}

// Initialize the Rune SDK once your game is fully ready
Rune.initClient({ onChange })
```

## Next Steps

- [View example games](examples.mdx)
- [Read more about game state syncing](how-it-works/syncing-game-state.md)
- [Publish your game](publishing/publishing-your-game.md)
- [Explore the API reference](api-reference.md)
- [Join the Rune Discord server](https://discord.gg/rune-devs)
