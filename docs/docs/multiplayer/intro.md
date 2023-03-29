---
sidebar_position: 1
---

# Intro

## Why use Rune?

Build a multiplayer game that reaches millions and let Rune handle all the complexity. Here's some things you **don't have to worry about** if you use Rune:

- Netcode
- Hosting servers
- Accounts & friends
- Voice chat
- Matchmaking
- Version mismatches
- Conflict resolution
- Spectating

## Install

Include the following lines in your `index.html` file before loading any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer.js"></script>
<script src="logic.js"></script>
```

## Game Logic

Create a file named `logic.js` with a `setup` function that returns initial values for your `game` state that should be [synced across players](syncing-game-state.md). Add an action that modifies this `game` state and calls `Rune.initLogic()`.  For instance, to give all players a score and have an action that just increments the score:

```js
// logic.js

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
    incrementScore(playerWhoGotPoints, { game }) {
      game.scores[playerWhoGotPoints]++
    }
  }
})
```

## Rendering

Next, integrate your game UI to [react to game state changes](api/multiplayer.md#runeinitclientoptions) and [send actions to the logic layer](api/multiplayer.md#runeinitclientoptions). This code may live anywhere except in `logic.js`; the docs will refer to `client.js`:

```js
// client.js

// Your game setup code...

// Trigger an action based on user input
button.onClick = () => {
  Rune.actions.incrementScore({
    playerWhoGotPoints: "player1",
  })
}

// Initialize the Rune SDK once your game is fully ready
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
    // Update game based on game state from logic.js
    render(newGame)
  },
})
```

## Next steps

- [Read about syncing game state](syncing-game-state.md)
- [Get inspired by the kinds of games that are supported](supported-games.md)
- [View example games](examples.md)
- [Explore the API reference](api/multiplayer.md)
- [Test your game with the Rune CLI](cli.md)
- [Publish your game](publishing.md)
