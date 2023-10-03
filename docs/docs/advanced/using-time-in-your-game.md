---
sidebar_position: 61
---

# Using Time in your Game

Many games like party games use time as an essential part of their game logic. Rune makes this easy by synchronizing clocks across clients and the server. We provide multiple ways for you to add time-based code in your game logic based on what's most fitting for your game.

## Game Time

You can use `Rune.gameTime()` inside your game, which returns the miliseconds that have passed since the start of the game. At the moment Rune provides time precision of a second, which should work well for most casual game purposes. 

For instance, this could be used to track how long it took for user to make a guess:

```javascript
// logic.js

function allPlayersDone(game) {
  // ...
}

function setNewQuestionAndAnswer(game) {
  // ...
}

Rune.initLogic({
  setup: (allPlayerIds) => {
    return {
      scores: Object.fromEntries(allPlayerIds.map((id) => [id, 0])),
      roundStartAt: 0,
      question: "A group of otters is called what?",
      correctAnswer: "A raft"   
    }
  },
  actions: {
    guess: ({ answer }, { game, playerId }) => {
      if (answer === game.correctAnswer) {
        // Increment score based on time
        const timeTaken = Rune.gameTime() - roundStartAt

        scores[playerId] += max(30 - timeTaken, 0)
      }

      // Start a new round once everyone has answered
      if (allPlayersDone(game)) {
        roundStartAt = Rune.gameTime()
        setNewQuestionAndAnswer(game)
      }
    },
  },
})

```

## Update Function

You can provide an `update` function inside your `logic.js` file to run game logic every second.
When game state is changed inside your `update` function, the `onChange` inside `client.js` is called with `update` event.

Here’s a game, where players have to make a move within 30 seconds or else their turn will pass:

```javascript
// logic.js

Rune.initLogic({
  // ... (previous example)
  update: ({ game }) => {
    // Check if 30 seconds has passed, then switch to another question
    if (Rune.gameTime() - game.roundStartAt > 30) {
      roundStartAt = Rune.gameTime()
      setNewQuestionAndAnswer(game)
    }
  }
})

```

## The `timeSync` Event

Network packets between the client and server are sometimes delayed due to bad internet connection. If that happens, the server might execute the action at different game time compared to the optimistic client action.
If this has impact on game state, the client that made the optimistic action will receive a `onChange` call with `timeSync` event.

Let's consider a game with the following game logic:

```javascript
// logic.js

Rune.initLogic({
  setup() {
    return {
      clickedAt: 0,
    };
  },
  actions: {
    click(_, { game }) {
      game.clickedAt = Rune.gameTime();
    },
  },
})
```

The game is played by two players (playerA, playerB), who do the following:

* PlayerA calls action click when game time is at second 4. PlayerA receives `onChange` call with `click` action as an argument, making PlayerA see `game.clickedAt = 4`.
* Server receives and processes the action at game time second 5.
* Every client receives that the action was executed at 5th second.

PlayerA's `onChange` function will be called with `timeSync` event to reconcile that the server processed the action at second 5 (and the server holds the truth). In this way, both players end up with `game.clickedAt = 5`.

## Further Reading

- [See how the Pinpoint example game uses time](https://github.com/rune/rune-games-sdk/blob/staging/examples/pinpoint/src/logic.ts)