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
    // ... remaining game logic
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
- If the engine has an explicit `render` function, the game can use Rune's `interpolateRender` function

The `interpolateRender` function computes the position at rendering time, which can be used by installing the [rune-interpolation package](https://github.com/rune/rune-games-sdk/blob/staging/packages/rune-interpolation). Here's an example of how this would be used for rendering the ball in Paddle at a variable frame rate: 

```javascript
// client.js

import { interpolateRender } from "rune-interpolation"

let ballPosition, ballPositionNext

function onChange({ currentGame, nextUpdateGame }) {
    ballPosition = currentGame.ballPosition
    ballPositionNext = nextUpdateGame!.ballPosition
}

function render() {
    const ballPositionRender = interpolateRender(ballPosition, ballPositionNext)
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
        // Paddles only move in 1 dimension so can just specify position and speed for that 
        const paddles = [
            { position: START_POSITION, speed: 0 },
            { position: START_POSITION, speed: 0 }
        ]
        return { paddles }
    },
    update: ({ game }) => {
        for (let i = 0; i < 2; i++) {
            
            // Move paddle
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
    },
    actions: {
        // ... (player inputs to move paddles by changing paddle speed)
    }
})

```

The `game` state is provided to the `onChange` callback as `currentGame` as described in [Syncing Game State](../how-it-works/syncing-game-state.md). Because of network latency, the position in `currentGame` may suddenly change dramatically for the other player's paddle. Without interpolation, the paddle would teleport around on the screen. To instead make the paddle movements look smooth, the game can use the interpolation helper provided as part of the [rune-interpolation package](https://github.com/rune/rune-games-sdk/blob/staging/packages/rune-interpolation).

The interpolation helper has built-in acceleration, meaning that the paddle will slowly start moving and then accelerate up to the top speed, which is provided by the game. Usually a good value for this is twice the default speed. The interpolation helper also has [additional options](https://github.com/rune/rune-games-sdk/blob/staging/packages/rune-interpolation) for more fine-grained control.



```javascript
// client.js

import { playerSpeed } from "./logic.js"
import { createInterpolator } from "rune-interpolation"

let opponentPaddlePosition = createInterpolator({ maxSpeed: playerSpeed * 2 })

function onChange({ currentGame, event }) {
    
    if (event.name === "update") {
       ...
    }
}

```

There might be special circumstances, where the game will want to immediately move the other players' positions without interpolating. For instance, after a point has been scored in Paddle, the player positions should be reset immediately without interpolation. The game can do this by calling `reset()` on the interpolator.

```javascript
// client.js

function onChange({ previousGame, currentGame, event }) {
    // ... (code from previous example)
    if (currentGame.score !== previousGame.score) {
        // TODO: ...
    } 
}

```

## Combining Rendering and Player Interpolation

The previous two sections covered interpolation for rendering and for other players' movement. The former interpolates between `update` calls and the latter across longer time periods. Normally, the rendering interpolation uses `nextGameUpdate` and `interpolateRender`, but ...

By combining these interpolations, the Paddle game has flexible frame rate rendering and smooth movements for other players regardless of network conditions. This gives the best player experience for the games that need it. You can try a [demo of the game here](/examples/paddle) or look at the [full code here](https://github.com/rune/rune-games-sdk/blob/staging/examples/paddle)!