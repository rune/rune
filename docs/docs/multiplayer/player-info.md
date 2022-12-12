---
sidebar_position: 3
---

# Player Info

The game will want to show each player’s name inside their game.

## Players Object

Info about the players is captured by a `players` object, which has an ID for each player as the key and an object with e.g. `displayName` as the value. These IDs are unique and randomly generated for each game. The players are organized in the players object in no particular order.

Here’s the values for each player:

- `displayName: string`
- `playerId: string` (same as key, just provided for simplicity)

## Your Player ID

In the `visualUpdate` function the client will always get their player ID as well as `yourPlayerId`. This can be used to find their own info in the `players` object.

Importantly, `yourPlayerId` will be undefined if they themselves are a spectator!
