---
sidebar_position: 20
---

# Player Info

You'll often want to show each player’s name and avatar inside your game. Here's how you do it.

## Players Object {#players-object}

*Deprecated:* Use [allPlayerIds](api-reference.md#all-player-ids) and [Rune.getPlayerInfo](api-reference.md#rune-get-player-info)

Info about the players is captured by a `players` object, which has an ID for each player as the key and an object with e.g. `displayName` as the value. These IDs are unique and randomly generated for each game. The players are organized in the players object in no particular order.

Here’s the values for each player:

- `displayName: string`
- `avatarUrl: string`
- `playerId: string` (same as key, just provided for simplicity)
  
## Players in Game {#players-in-game}

The list of IDs of players who are active in the game is provided in the `OnChange` callback through the `allPlayerIds` array. This list contains all players who are playing and are still connected to the room.

## Getting Player Info {#getting-player-info}

The `Rune.getPlayerInfo(id)` function is used to retrieve information about a player. The returned object contains the following values:

- `displayName: string`
- `avatarUrl: string`
- `playerId: string` (same as key, just provided for simplicity)

Note that you can pass the ID of a player that is no longer in game and get placeholder information.

## Avatars {#avatars}

Using avatars is a great way to personalize the UI to show whose turn it is or in a leaderboard. Since the avatar is loaded over the network there might be a slight delay during which you might want to display a placeholder – and we got you covered!

![Avatar placeholder](/img/avatar-placeholder.svg)

Right click and select download either as [SVG](/img/avatar-placeholder.svg) or [PNG](/img/avatar-placeholder.png).

## Your Player ID {#your-player-id}

In the `onChange` function the client will always get their player ID as well as `yourPlayerId`. This can be used to find their own info in the `players` object.

Importantly, `yourPlayerId` will be undefined if they themselves are a spectator!
