---
sidebar_position: 0
---

# Philosophy

We believe that there's millions of developers around the world who would love to build a multiplayer game, especially if it will be played by a massive community like Rune's. We want to enable you to do that by handling the netcode, servers, voice chat, matchmaking, spectating, etc. and otherwise get as much out of your way as possible.

Our multiplayer SDK lets you write your game logic in JavaScript/TypeScript and use any HTML5-compatible rendering framework for your game UI + graphics. This means that you can build your game with pure JS, React, Vue, PixiJS, Svelte, and even use custom WASM-compiled code. You can also use game engines like Unity, Godot, or Defold for rendering. We want Rune to be flexible, that's why we deliberately chose to make an SDK and not a game engine.

Rune synchronizes your game state using our custom predict-rollback framework. Simulating the game in parallel on all clients and server ensures that the game is always snappy for local inputs, which is crucial when playing on mobile internet with high latency. Our server-authoritative predict-rollback approach also allow us to handle conflict resolution through rollbacks. For instance, if two players shoot each other in a game, the server will decide which one shot first, and rollback the action for the player who got shot. That player will receive the information that their action was rolled back so the game can show it to the player.

We try our best to make an amazing SDK for you and we'd love to get your input on how we can improve! Please write us on [Discord](https://discord.gg/rune-devs) if you have any questions or suggestions. 

## Read More

- [How the game state syncs across devices](how-it-works/syncing-game-state.md)
- [How we run your logic code on Rune servers](advanced/logic-restrictions.md)
- [How we make randomness deterministic across clients](advanced/randomness.md)
- [Explore the API reference](api-reference.md)
