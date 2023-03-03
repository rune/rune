---
sidebar_position: 3
---

# Player Info

The game will want to show each player’s name inside their game.

## Players Object

Info about the players is captured by a `players` object, which has an ID for each player as the key and an object with e.g. `displayName` as the value. These IDs are unique and randomly generated for each game. The players are organized in the players object in no particular order.

Here’s the values for each player:

- `displayName: string`
- `avatarUrl: string`
- `playerId: string` (same as key, just provided for simplicity)

## Avatars

Using avatars is a great way to personalize the UI to show who's turn it is or in a leaderboard. Since the avatar is loaded over the network there might be a slight delay during which you might want to display a placeholder – and we got you covered!

![Avatar placeholder](/img/avatar-placeholder.svg)

Right click and select download either as [SVG](/img/avatar-placeholder.svg) or [PNG](/img/avatar-placeholder.png).

## Your Player ID

In the `visualUpdate` function the client will always get their player ID as well as `yourPlayerId`. This can be used to find their own info in the `players` object.

Importantly, `yourPlayerId` will be undefined if they themselves are a spectator!
