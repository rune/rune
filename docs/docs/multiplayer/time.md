---
sidebar_position: 61
---

# Time

## Game time

If your game requires access to time, Rune exposes `Rune.gameTimeInSeconds()` that you can use inside logic.js.
Calling it returns the amount of seconds that have passed since the start of the game.

At the moment Rune allows timers with an accuracy of a second.

For instance this could be used to track how long it took for user to make a guess:

```javascript
// logic.js

Rune.initLogic({
  setup() {
    return {
      guessRequestedAt: 0,
      guessDuration: 0
    };
  },
  actions: {
    requestGuess(_, {game}) {
      game.guessRequestedAt = Rune.gameTimeInSeconds();
    },
    confirmGuess(_, {game}) {
      game.guessDuration = Rune.gameTimeInSeconds() - game.guessDuration;
    }
  }
})
```

## Update function

If your game requires some logic to run every second, Rune allows you to provide `update` function inside `logic.js`.

When game state is changed inside `update` function, `onChange` inside `client.js` is called with `update` event.

```javascript
// logic.js

Rune.initLogic({
  setup() {
    return {
      allowToGuess: false,
      guessRequestedAt: 0,
      guessDuration: 0
    };
  },
  actions: {
    requestGuess(_, {game}) {
      game.allowToGuess = true;
      game.guessRequestedAt = Rune.gameTimeInSeconds();
    },
    confirmGuess(_, {game}) {
      game.guessDuration = Rune.gameTimeInSeconds() - game.guessDuration;
    }
  },
  update: ({game}) => {
    //Check if 30 seconds have passed, then disallow guessing
    if (game.allowToGuess && Rune.gameTimeInSeconds() - game.guessRequestedAt > 30) {
      game.allowToGuess = false
    }
  }
})
```


## `timeSync` event

Running timers and keeping them in sync requires quite a lot of complexity.
Lets take an example:
* Client executes an action when gameTime is at second 4.
* Server receives the action, but server is already at second 5.
* Every client receives that the action was executed at 5th second.

In this scenario the client that executed the action will receive `timeSync` event, 
indicating that something has changed due to action being executed at different time.