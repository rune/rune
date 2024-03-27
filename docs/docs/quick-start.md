---
sidebar_position: 0
---

# Quick Start

Build a multiplayer game for the [Rune platform](https://www.rune.ai) and its millions of players. Rune handles netcode, servers, voice chat, matchmaking, spectating, and much more!

## New game {#new-game}

Creating a new game on Rune is really simple and should only take a couple of minutes! You just need to run the following command to get started:

```sh
npx rune-games-cli@latest create
```

This will guide you through setup. It includes:
1. Choosing a game directory name.
2. Selecting an initial game template. All templates contain a tic tac toe game example to build from.
3. Installing dependencies. This should take under a minute. 

Once the installation is done, the CLI will indicate that [dev ui](http://localhost:3000/docs/publishing/simulating-multiplayer) is ready to use. Just follow the link or scan the QR code with your phone to see the game.

# Existing game {#existing-game}

Already have a great game? Follow the [guide to port your existing game to Rune](./how-it-works/existing-game.md). 


## Uploading your game {#uploading-your-game}

To fully experience what Rune allows you to do, you should upload the game.
Run `npm run upload`. This is it! After doing this you'll be able to test out the game directly inside Rune app and play it with your friends. 

## Modifying the game {#modifying-the-game}

Playing tic tac toe is fun, but you probably want to build something more complex.
To do it you need to know that Rune games are split into two parts: logic & rendering.
Lets make a game where your score increases when you click a button!

## Game Logic {#game-logic}

Game logic (`logic.js` file in your game) is responsible for creating an initial game state that is synced across players. It also allows you to define actions that allow you to modify game state.
For instance, to give all players a score and have an action that just increments the score:

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
You can find explanation for how all of it works in [syncing game state](how-it-works/syncing-game-state.md).


## Rendering {#rendering}

Game rendering (`client.js` file in your game) is responsible for reacting to game state changes and sending actions to the logic. For instance to handle the logic changes listed above, client should look like this:

```js
// client.js

const button = document.getElementById("button")

let yourPlayerID;

// Trigger an action based on user input
button.onClick = () => {
  Rune.actions.incrementScore({
    playerWhoGotPoints: yourPlayerID,
  })
}

// Callback you define for when something changes (e.g. someone made an action)
function onChange(props) {
  yourPlayerID = props.yourPlayerId
  // Your game visuals update code...
}

// Initialize the Rune SDK once your game is fully ready
Rune.initClient({ onChange })
```

You can find additional information about [rendering here](how-it-works/syncing-game-state.md#rendering).

## What to do next? {#next-steps}

- If you want some inspiration, we really recommend [checking out example games](examples.mdx)!
- Building games is more fun when you are a part of community, [join Rune Discord server](https://discord.gg/rune-devs).
- If your game is ready to be published, check out [publishing your game docs](publishing/publishing-your-game.md)
- Want to know everything that Rune supports? [Explore the API reference](api-reference.md)
