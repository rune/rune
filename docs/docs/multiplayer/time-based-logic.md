---
sidebar_position: 61
---

# Time-Based Logic

## Game Time

Rune exposes `Rune.gameTimeInSeconds()` that you can use inside logic.js, which returns the amount of seconds that have passed since the start of the game.
At the moment Rune provides time precision of a second, which should work well for most casual game purposes.

For instance this could be used to track how long it took for user to make a guess:

```javascript
// logic.js

function allPlayersDone(game) {
  //...
}

function setNewQuestionAndAnswer(game) {
  //...
}

Rune.initLogic({
  setup: (playerIds) => ({
    scores: Object.fromEntries(playerIds.map((id) => [id, 0])),
    roundStartAt: 0,
    question: "A group of otters is called what?",
    correctAnswer: "A raft"
  }),
  actions: {
    guess: ({ answer }, { game, playerId }) => {
      if (answer === game.correctAnswer) {
        // Increment score based on time
        const timeTaken = Rune.gameTimeInSeconds() - roundStartAt

        scores[playerId] += max(30 - timeTaken, 0)
      }

      // Start a new round once everyone has answered
      if (allPlayersDone(game)) {
        roundStartAt = Rune.gameTimeInSeconds()
        setNewQuestionAndAnswer(game)
      }
    },
  },
})

```

## Update function

You can provide an `update` function inside your `logic.js` file to run game logic every second.
When game state is changed inside your `update` function, the `onChange` inside `client.js` is called with `update` event.

Here’s an example of how a game could implement that players have to make a move within 30 seconds or else their turn will pass:

```javascript
// logic.js

Rune.initLogic({
  //... (previous example)
  update: ({game}) => {
    //Check if 30 seconds have passed, then switch to another question
    if (Rune.gameTimeInSeconds() - game.roundStartAt > 30) {
      roundStartAt = Rune.gameTimeInSeconds()
      setNewQuestionAndAnswer(game)
    }
  }

})

```


## `timeSync` event

It is possible for the server to execute the action at different gameTime compared to the optimistic client action.
If this has impact on game state, the client that made the optimistic action will receive a `onChange` call with `timeSync` event.

Let's take the following example: The game is played by two players (playerA, playerB) and the following logic is defined:

```javascript
// logic.js

Rune.initLogic({
  setup() {
    return {
      clickedAt: 0,
    };
  },
  actions: {
    click(_, {game}) {
      game.clickedAt = Rune.gameTimeInSeconds();
    },
  },
})
```

* PlayerA calls action click when game time is at second 4. PlayerA receives `onChange` call with `click` action as an argument. PlayerA `game.clickedAt = 4`.
* Server receives the action, but server is already at second 5. Server processes the action.
* Every client receives that the action was executed at 5th second. 
PlayerA `onChange` is called with `timeSync` event, playerB `onChange` is called with `click` action. Both players `game.clickedAt = 5`.