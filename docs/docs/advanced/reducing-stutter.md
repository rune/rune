---
sidebar_position: 62
---

# Reducing Stutter

This page focuses on reducing stutter for fast-paced multiplayer games running an update loop many times pr. second. However, you can also make really fun [real-time multiplayer games](real-time-games.md) without needing the more complex code described below. If you're new to Rune or game development, we suggest you start making a game without an update loop. See the [example games](../examples.mdx) for inspiration.

We will use the example of [Paddle](https://github.com/rune/rune-games-sdk/blob/staging/examples/paddle) to explain how Rune makes it simple to make fast-paced multiplayer games. A game like Paddle is updating the position of the ball and the players' paddles many times per second. We can code this in the `logic.js` file by specifying an `update` function and the `updatesPerSecond` value. In the following example, the `update` function will be called 30 times per second on all clients.

```javascript
Rune.initLogic({
  update: ({ game }) => {
    game.ballPosition += game.ballSpeed
    // ... (remaining game logic)
  },
  updatesPerSecond: 30
})
```

## Rendering At Variable Frame Rate

The update loop will always run at a fixed tick rate, but mobile phones will render your game's graphics slower or faster than that. This is highly dependent on how powerful the device is and how intensive your game is to run. To support rendering at a variable frame rate, your game can interpolate positions between the `update` function calls. This is only needed for fast-moving objects stored in the `game` state such as the ball and paddles in Paddle.

Consider a Paddle game with `updatesPerSecond: 10`, i.e. the game state updates every 100 ms. The ball is at position 0 in `game` at 0 ms and will be at position 10 in after 100 ms. When the phone wants to render the game at 60 ms, it should render at position 6 as the ball should be 60% towards the new position.

Rune provides `futureGame`, which contains the game state after another run of the `update` function, thereby providing a glimpse into the future. The game can interpolate between the current game state and the future game state by using `Rune.interpolator()`. The interpolator allows the game to compute the ball's position at any time and will make the game look more fluid for fast-moving objects. Here's how this would be used for rendering the ball in Paddle at a variable frame rate: 

```javascript
const ballInterpolator = Rune.interpolator()

function onChange({ game, futureGame }) {
  ballInterpolator.update({
    game: game.ballPosition,
    futureGame: futureGame.ballPosition
  })
}

// Rendering function called by the game's graphics engine
function render() {
  const ballPosition = ballInterpolator.getPosition()
    
  // ... (draw the ball using the game's graphics engine)
}

// Initialize the game with the callback function
Rune.initClient({ onChange })
```

There might be game-specific scenarios, where the game should not interpolate into the future. For instance, when a point is scored in Paddle, the ball position will reset in `logic.js` and the game should not interpolate the position between `game` and `futureGame`. The game can do this by not calling `update()` on the interpolator in that scenario, i.e. updating the code above with an if condition checking the current score vs. the future score:

```javascript
// Replaces function in previous code block
function onChange({ game, futureGame }) {
    
  if (game.totalScore === futureGame.totalScore) {
    ballInterpolator.update({
      game: game.ballPosition,
      futureGame: futureGame.ballPosition
    })
  }
}
```

## Interpolating Other Players' Movements

Making fast-paced multiplayer games can be challenging because of the latency between players. No matter how good the device and internet connection is, the network packets cannot travel faster than the speed of light. This means that your game will receive other's players actions some time after they happened. If other players can quickly move around in your game, then you will need to do interpolation of their positions to make their movements look smooth. This is done in the client-side code, i.e. in `client.js`.

:::tip

First implement your game without interpolation for simplicity. Then you can test in the Dev UI whether it's actually needed.

:::

In Paddle, the players control the paddles, and the game must therefore interpolate the other players' paddles to get smooth movements. The core game state and update loop in paddle could be defined as this:

```javascript
Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  updatesPerSecond: 30,
  setup: (allPlayerIds) => {
    // Paddles only move in 1 dimension so can just specify one position and speed 
    const paddles = [
      { position: START_POSITION, speed: 0 },
      { position: START_POSITION, speed: 0 }
    ]
    const players = [
      { id: allPlayerIds[0], score: 0 },
      { id: allPlayerIds[1], score: 0 },
    ]
    return { paddles, players, totalScore: 0 }
  },
  update: ({ game }) => {
    for (let i = 0; i < 2; i++) {
      game.paddles[i].position += game.paddles[i].speed
            
      // Clamp to sides
      if (game.paddles[i].position < 0) {
        game.paddles[i].position = 0
        game.paddles[i].speed = 0
      }
      if (game.paddles[i].position + PADDLE_WIDTH > GAME_WIDTH) {
        game.paddles[i].position = 0
        game.paddles[i].speed = 0
      }
    }
    // ... (remaining game logic)
  },
  actions: {
    // ... (player inputs to move paddles by changing paddle speed)
  }
})
```

The `game` state is provided to the `onChange` callback as `game` as described in [Syncing Game State](../how-it-works/syncing-game-state.md). Because of network latency, the position in `game` may suddenly change dramatically for the other player's paddle. Without interpolation, the paddle would teleport around on the screen. To instead make the paddle movements look smooth despite the latency, the game can create an interpolator using `Rune.interpolatorLatency`.

The game should call the interpolator's `update()` function, which moves the interpolated position towards the true position specified in `game`. The game can at any time get the interpolated position from the interpolator by calling `getPosition()`. This function returns the position adjusted for the time of rendering (see section above) so it can be used directly to achieve both interpolation and supporting variable frame rate.

Here's that code for the paddle game:

```javascript
import { playerSpeed } from "./logic.js"

let opponentInterpolator = Rune.interpolatorLatency({ maxSpeed: playerSpeed })

function onChange({ game, futureGame, yourPlayerId }) {
  const opponent = game.players.findIndex((p) => p.id !== yourPlayerId)
   
  opponentInterpolator.update({
    game: game.paddles[opponent].position,
    futureGame: futureGame.paddles[opponent].position
  })
}

// Rendering function called by the game's graphics engine
function render() {
    const opponentPosition = opponentInterpolator.getPosition()

    // ... (draw the opponent's paddle using the game's graphics engine)
}

// Initialize the game with the callback function
Rune.initClient({ onChange })
```

There might be game-specific scenarios, where the game will want to immediately move the other players' positions without interpolating. For instance, when a point is scored in Paddle, the player positions reset in `logic.js` and the opponent position should be updated immediately. The game can detect that a point was just scored by comparing `game` with `previousGame`, which contains the game state for the last `onChange` call. The game can then call `moveTo()` on the interpolator, which will also reset the speed inside the interpolator to zero so that it doesn't move anywhere. Here's the code for that:

```javascript
function onChange({ previousGame, game }) {
  const opponent = game.players.findIndex((p) => p.id !== yourPlayerId)
    
  if (previousGame.totalScore < game.totalScore) {
    opponentInterpolator.moveTo(game.paddles[opponent].position)
  }
}
```

## Demo and Example Game

Using the interpolations described above, your game can achieve flexible frame rate rendering and smooth movements for other players regardless of network conditions. This gives the best player experience for the games that need it. If you want to make your own real-time Rune game, it's great to start with the Paddle example game. You can [try the demo](/examples/paddle) and see how the opponent gets interpolated when simulating latency. You can also see the [full code here](https://github.com/rune/rune-games-sdk/blob/staging/examples/paddle)!