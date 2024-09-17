---
sidebar_position: 63
---

# Physics

Physics in multiplayer games can be difficult to implement, though [real-time multiplayer games](real-time-games.md) can be a lot of fun with a shared physics experience. Networking physics is hard because you need fully cross-platform deterministic code and to synchronize the inputs to that engine, along with supporting rollback.

Your options are:

1. Rune-compatible physics engines like [Propel.js](https://github.com/kevglass/propel-js/) (recommended)
1. Custom physics code built specifically for the game
1. Client-side physics

## Rune-Compatible Physics Engines

Rune ensures that any JS game logic code is cross-platform deterministic by using a [set of rules](../how-it-works/server-side-logic.md) and by patching [non-deterministic functions](https://developers.rune.ai/blog/making-js-deterministic-for-fun-and-glory/). By using a compatible physics engine, for instance [Propel.js](https://github.com/kevglass/propel-js/), Rune ensures that it's deterministic and synchronized across clients and server.

## Custom Physics

Many successful games use custom physics/collision built for the specific game. Custom code can be simple since it can be built specifically to handle the scenarios in the game and no others. It can also allow features that aren't physically correct - but end up being a lot of fun.

For an example of building a custom physics system for a platformer game, check out our [tech demos](../examples/tech-demos).

## Client-side Physics

It is possible to use physics on each client in the renderer only and synchronize only the inputs to the physical system. This relies on the physics engine being deterministic across different JavaScript engines and platforms. 

We don't recommend this approach since it's complicated and prone to error causing game state desyncs between clients. 