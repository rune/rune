---
sidebar_position: 1
---

# Multiplayer Setup

:::caution

The Multiplayer SDK is currently in beta. There will be some rough edges, and some APIs might change.

:::

## Install

Include the following lines in your `index.html` file before loading any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer.js"></script>
<script src="logic.js"></script>
```

## Game Logic

Create a file named `logic.js` that will be responsible for [syncing game information](syncing-game-state.md) among the players:

```js
// logic.js

function isVictoryOrDraw(game) {
  // Check winner
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    const scores = {}
    for (let playerId of playerIds) {
      scores[playerId] = 0
    }
    return { scores }
  },
  actions: {
    myAction: (payload, { game, playerId }) => {
      // Check it's not the other player's turn
      if (game.lastPlayerTurn !== playerId) {
        throw Rune.invalidAction()
      }

      // Increase score and switch turn
      game.scores[playerId]++
      game.lastPlayerTurn = playerId

      // Determine if game has ended
      if (isVictoryOrDraw(game)) {
        Rune.gameOver()
      }
    },
  },
})
```

## UI Integration

Next, integrate your game UI to [react to game state changes](api/multiplayer.md#runeinitclientoptions) and [send actions to the logic layer](api/multiplayer.md#runeinitclientoptions). This code may live anywhere except in `logic.js`; the docs will refer to `client.js`:

```js
// client.js

// Your game setup code...

// Trigger an action based on user input
button.onClick = () => {
  Rune.actions.myAction({
    myId: "button",
  })
}

// Initialize the Rune SDK once your game is fully ready.
Rune.initClient({
  visualUpdate: ({
    newGame,
    oldGame,
    yourPlayerId,
    players,
    action,
    event,
    rollbacks,
  }) => {
    // Update interface based on game state from logic.js.
    render(newGame)
  },
})
```

## Next steps

- [Read about syncing game state](syncing-game-state.md)
- [Get inspired by the kinds of games that are supported](supported-games.md)
- [View example games](examples.md)
- [Explore Rune Multiplayer SDK API docs](api/multiplayer.md)
