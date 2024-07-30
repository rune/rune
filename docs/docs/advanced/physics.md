---
sidebar_position: 63
---

# Physics

This page focuses on making use of physics in multiplayer games. [Real-time multiplayer games](real-time-games.md) often use physic systems to control players and environment which can lead to fun experiences. Physics can be performance intensive on mobile so it's worth considering carefully which approach you take. 

## Physics in the Game Logic

The ideal case is that the physics model itself runs in the game logic. This lets you take advantage of Dusk's predict-rollback mechanism in resolving conflicts between player actions. It's also easier to build your game this way.

### Physics Engines

The Dusk system prevents you from using [unsafe patterns](../server-side-logic.md) when developing your game logic. This is to ensure that everything remains deterministic. These 
limitations can prevent storing traditional physics engine's data in the game state. There are two approaches that can be used to put physics in game state:

1. Use a physics engine that maintains its state as serializable objects, such as [Propel.js](https://github.com/kevglass/propel-js/)
1. If the physics engine supports serializing its state efficiently, that can be stored in game state and deserialized each frame.

### Custom Physics

Making real-time games mobile performant is difficult when you rely on a complete physics engine. Another options is to build a simple physics system custom to your game. Along with performance this can allow you to add non-physically correct features! 

For an example of building a custom physics system for a platform check out our [tech demos](../examples/tech-demos)

## Running Physics Client Side Only

Most physics engines are deterministic in that given the same inputs they'll generate the same result. It is possible to use physics on each client, in the renderer only, and synchronize only the inputs to the physical system. We don't recommend this approach since its complicated and prone to error causing state de-syncs between clients. 