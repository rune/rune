---
sidebar_position: 63
---

# Physics

This page focuses on making use of physics in multiplayer games. [Real-time multiplayer games](real-time-games.md) often use physic systems to control players and environment which can lead to fun experiences. Physics can be performance intensive on mobile so it's worth considering carefully which approach you take. 

Your options are:

1. Dusk-compatible physics engines like [Propel.js](https://github.com/kevglass/propel-js/) (recommended)
1. Custom physics code built specifically for the game
1. Client-side physics

## Dusk Compatible Physics Engines

The Dusk system prevents you from using [unsafe patterns](../how-it-works/server-side-logic.md) when developing your game logic. This is to ensure that everything remains deterministic. For a physics engine to be Dusk compatible its world/body state must be serializable and it must be safe in the server side logic, for instance [Propel.js](https://github.com/kevglass/propel-js/).

## Custom Physics

Many successful releases use custom physics/collision built for the specific game. Custom code can be simple since it can be built specifically to handle the scenarios in the game and no others. It can also allow features that aren't physically correct - but end up being a lot of fun.

For an example of building a custom physics system for a platform check out our [tech demos](../examples/tech-demos)

## Client-side Physics

It is possible to use physics on each client, in the renderer only, and synchronize only the inputs to the physical system. This relies on the physics engine being deterministic across different JavaScript engines and platforms. 

We don't recommend this approach since its complicated and prone to error causing state de-syncs between clients. 