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
    // TOOD
  },
  updatesPerSecond: 30
})

```

The `update` function is run in a synchronized way across all clients and the server. Only actions are sent to the server, which makes Rune real-time games very bandwidth efficient so that they can work even on mobile devices with limited bandwidth.

## Rendering At Variable Frame Rate

The update loop will always run at a fixed tick rate, but mobile phones will render your game's graphics slower or faster than that. This is highly dependent on how powerful the device is and how intensive your game is to run. To support rendering at a variable frame rate, your game can extrapolate positions between the `update` function calls. This is only needed for fast-moving objects stored in the `game` state such as the ball and paddles in Paddle.

Consider a Paddle game with `updatesPerSecond: 10`, i.e. the game state updates every 100 ms. The ball is at position 0 in `currentGame` at 0 ms and will be at position 10 in after 100 ms. When the phone wants to render the game at 60 ms, it should render at position 6 as the ball should be 60% towards the new position.

Rune provides `nextGameUpdate`, which contains the game state after another run of the `update` function, thereby providing a glimpse into the future. This is provided in the `onChange` callback. Additionally, the game can at any time get the milliseconds between updates as `Rune.msPerUpdate`. By using these, the game can render the ball's at any time and will look more fluid for fast-moving objects.

How to do that depends on the graphics engine:
- If the engine supports animating between positions, then the game can animate between `currentGame` and `nextUpdateGame`
- If the engine has an explicit `render` function, then the game can use Rune's `interpolateRender` function

The `interpolateRender` function computes the position at rendering time. This can be used by installing the `rune-interpolation` package. Here's an example of how this would be used for rendering the ball in Paddle at a variable frame rate: 

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

## Interpolation

Making fast-paced multiplayer games can be challenging because of the latency between players. No matter how good the device and internet connection is, the network packets cannot travel faster than the speed of light. This means that your game will receive other's players actions some time after they happened. 

If other players can quickly move around in your game, then you will need to do interpolation. To be added...