---
sidebar_position: 0
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

## Setting up a new project

```sh
npx rune-games-cli@latest create
```

## Integrate with existing game

Include the following lines in your `index.html` file before loading any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/multiplayer-dev.js"></script>
<script src="logic.js"></script>
```

## Game Logic

Create a file named `logic.js` with a `setup` function that returns initial values for your `game` state that should be [synced across players](multiplayer/syncing-game-state.md). Add an action that modifies this `game` state and call `Rune.initLogic()` to initialize. For instance, to give all players a score and have an action that just increments the score:

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
    },
  },
})
```

## Rendering

Next, integrate your game UI to [react to game state changes](multiplayer/api-reference.md#runeinitclientoptions) and [send actions to the logic layer](multiplayer/api-reference.md#runeinitclientoptions). This code may live anywhere except in `logic.js`; the docs will refer to `client.js`:

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
function onChange({ oldGame, newGame, yourPlayerId, players, action, event }) {
  // Your game visuals update code...
}

// Initialize the Rune SDK once your game is fully ready
Rune.initClient({ onChange })
```

## Next steps

- [Read about syncing game state](multiplayer/syncing-game-state.md)
- [Get inspired by the kinds of games that are supported](multiplayer/supported-games.md)
- [View example games](examples.mdx)
- [Explore the API reference](multiplayer/api-reference.md)
- [Test your game with the Rune CLI](cli.md)
- [Publish your game](publishing.md)
