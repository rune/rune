---
sidebar_position: 20
---

# Player Info

You'll often want to show each player’s name and avatar inside your game. Here's how you do it.

## Getting Player Info {#getting-player-info}

Your game receives `allPlayerIds` array in the `onChange` callback, which contains the IDs of all players currently playing. Then use `Rune.getPlayerInfo(playerId)` with a playerId to get info about that player:

- `displayName: string`
- `avatarUrl: string`
- `playerId: string` (same as key, just provided for simplicity)

Note that you can pass the ID of a player that is no longer in game and get placeholder information.

## Avatars {#avatars}

Using avatars is a great way to personalize the UI to show whose turn it is or in a leaderboard. Since the avatar is loaded over the network there might be a slight delay during which you might want to display a placeholder – and we got you covered!

![Avatar placeholder](/img/avatar-placeholder.svg)

Right click the link above and select download either as [SVG](/img/avatar-placeholder.svg) or [PNG](/img/avatar-placeholder.png).

## Your Player ID {#your-player-id}

The `onChange` function provides the client's player ID as `yourPlayerId`. This can be used to find their own info using the `getPlayerInfo()` function described above.

:::tip
Importantly, `yourPlayerId` will be undefined if the client is a spectator!
