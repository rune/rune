---
sidebar_position: 62
---

# Real-Time Games

Rune supports making many kinds of real-time multiplayer games. This page focuses on real-time multiplayer games involving an update loop running many times pr. second. However, you can also make really fun real-time multiplayer games without needing the more complex code described below. If you're new to Rune or game development, we suggest you start making a game without an update loop. See the [example games](../examples.mdx) for inspiration.

We will use the example of [Paddle](https://github.com/rune/rune-games-sdk/blob/staging/examples/paddle) to explain how Rune makes it simple to make real-time multiplayer games.

## Lots of Game Updates

A game like Paddle is updating the position of the ball and the players' paddles many times per second. We can code this in the `logic.js` file by specifying an `update` function and the `updatesPerSecond` value. In the following example, the `update` function will be called 30 times per second on all clients.

```javascript
// logic.js

Rune.initLogic({
  update: ({ game }) => {
    game.ballPosition += game.ballSpeed
    // ... (remaining game logic)
  },
  updatesPerSecond: 30
})

```

The `update` function is run in a synchronized way across all clients and the server. Only actions are sent to the server, which makes Rune real-time games very bandwidth efficient so that they can work even on mobile devices with limited bandwidth.

## Rendering At Variable Frame Rate

The update loop will always run at a fixed tick rate, but mobile phones will render your game's graphics slower or faster than that. This is highly dependent on how powerful the device is and how intensive your game is to run. To support rendering at a variable frame rate, your game can extrapolate positions between the `update` function calls. This is only needed for fast-moving objects stored in the `game` state such as the ball and paddles in Paddle.

Consider a Paddle game with `updatesPerSecond: 10`, i.e. the game state updates every 100 ms. The ball is at position 0 in `currentGame` at 0 ms and will be at position 10 in after 100 ms. When the phone wants to render the game at 60 ms, it should render at position 6 as the ball should be 60% towards the new position.

Rune provides `nextGameUpdate`, which contains the game state after another run of the `update` function, thereby providing a glimpse into the future. This is provided in the `onChange` callback. Additionally, the game can at any time get the milliseconds between updates as `Rune.msPerUpdate`. By using these, the game can render the ball's at any time and will look more fluid for fast-moving objects.

How to do that depends on the game's graphics engine:
- If the engine supports animating between positions, the game can animate between `currentGame` and `nextUpdateGame`
- If the engine has an explicit `render` function, the game can use the `Rune.interpolate.rendering()` function

Here's an example of how `Rune.interpolate.rendering()` would be used for rendering the ball in Paddle at a variable frame rate: 

```javascript
// client.js

let ballPosition, ballPositionNext

function onChange({ currentGame, nextUpdateGame }) {
  ballPosition = currentGame.ballPosition
  ballPositionNext = nextUpdateGame!.ballPosition
}

function render() {
  const ballPositionRender = Rune.interpolate.rendering(ballPosition, ballPositionNext)
  drawBall(ballPositionRender)
}

```

## Interpolating Other Players' Movements

Making fast-paced multiplayer games can be challenging because of the latency between players. No matter how good the device and internet connection is, the network packets cannot travel faster than the speed of light. This means that your game will receive other's players actions some time after they happened. If other players can quickly move around in your game, then you will need to do interpolation of their positions to make their movements look smooth. This is done in the client-side code, i.e. in `client.js`.

:::tip

First implement your game without interpolation for simplicity. Then you can test in the Dev UI whether it's actually needed.

:::

In Paddle, the players control the paddles, and the game must therefore interpolate the other players' paddles to get smooth movements. The core game state and update loop in paddle could be defined as this:

```javascript
// logic.js

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
    return { paddles, players }
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

The `game` state is provided to the `onChange` callback as `currentGame` as described in [Syncing Game State](../how-it-works/syncing-game-state.md). Because of network latency, the position in `currentGame` may suddenly change dramatically for the other player's paddle. Without interpolation, the paddle would teleport around on the screen. To instead make the paddle movements look smooth, the game can create an interpolator for interpolating the movements over time using `Rune.interpolate.createInterpolator()`.

The interpolator has built-in acceleration, meaning that the paddle will slowly start moving and then accelerate up to a top speed defined by the game. Usually a good value for the max speed is twice the normal player speed. By default, the acceleration takes 500 ms to reach max speed. The game can also modify this if desired by providing the `timeToMaxSpeed` option.

The game should call the interpolator's `update()` function every time the `onChange` callback is called with the `update` event. This will make the interpolated position move towards the true position specified in `currentGame`. Here's that code for the paddle game:

```javascript
// client.js

import { playerSpeed } from "./logic.js"

let opponentInterpolator = Rune.interpolate.createInterpolator({ maxSpeed: playerSpeed * 2 })

function onChange({ currentGame, nextUpdateGame, event, yourPlayerId }) {
    
  const opponent = currentGame.players.findIndex((p) => p.id !== yourPlayerId)
   
  if (event.name === "update") {
    opponentInterpolator.update({ 
      currentGame: currentGame.paddles[opponent].position,
      nextUpdateGame: nextUpdateGame.paddles[opponent].position
    })
  }
}

```

The paddle game can at any time get the interpolated position from the interpolator by calling `getPosition()`. As games with interpolation often want to render at a variable frame rate, the function returns three different versions of the position to easily support that: `currentGame`, `nextUpdateGame`, and `rendering`. As described in the section above, games using an animation framework will use `currentGame` and `nextUpdateGame`, whereas games with an explicit `render()` function will use `rendering`. Below is the code for using `rendering`:

```javascript
// client.js
// ... (code from previous example)

function render() {
  const opponentPosition = opponentInterpolator.getPosition().rendering
  drawOpponent(opponentPosition)
}

```

There might be special circumstances, where the game will want to immediately move the other players' positions without interpolating. For instance, after a point has been scored in Paddle, the player positions should be reset immediately without interpolation. The game can do this by calling `reset()` on the interpolator:

```javascript
// client.js
// ... (code from previous example)

function onChange({ previousGame, currentGame }) {
    
  const previousTotal = previousGame.players[0].score + previousGame.players[1].score
  const currentTotal = currentGame.players[0].score + currentGame.players[1].score
    
  if (previousTotal !== currentTotal) {
    opponentInterpolator.reset()
  }
}

```

## Demo and Example Game

Using the interpolations described above, your game can achieve flexible frame rate rendering and smooth movements for other players regardless of network conditions. This gives the best player experience for the games that need it. If you want to make your own real-time Rune game, it's great to start with the Paddle example game. You can [try the demo](/examples/paddle) and see how the opponent gets interpolated when simulating latency. You can also see the [full code here](https://github.com/rune/rune-games-sdk/blob/staging/examples/paddle)!