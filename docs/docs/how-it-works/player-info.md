---
sidebar_position: 20
---

# Player Info

You'll often want to show each player’s name and avatar inside your game. Here's how you do it.

## Getting Player Info {#getting-player-info}

Your game receives `allPlayerIds` array in the `onChange` callback, which contains the IDs of all players currently playing. Then use `Dusk.getPlayerInfo(playerId)` with a playerId to get info about that player:

- `displayName: string`
- `avatarUrl: string`
- `playerId: string` (same as key, just provided for simplicity)

Note that you can pass the ID of a player that is no longer in game and get placeholder information.

## Avatars {#avatars}

Every player on Dusk has their own personalized avatar. We let you use these avatars in your game, which has many benefits:

- Players can easily see which friend is playing what character in your game
- Makes it easy to show players in your UI, leaderboards, etc.
- Consistency between your game and other popular games on Dusk

Below are some examples of what the avatars look like.

<img src="/img/avatars.png" alt="Avatars" width="400"/>

## Avatar Placeholder

Since the avatar is loaded over the network there might be a slight delay. You might want to display a placeholder during loading - we got you covered!

<img src="/img/avatar-placeholder.png" alt="Avatar placeholder" width="100"/>

Right-click on the image above and download it to your game (or use [this link](/img/avatar-placeholder.png)).

## Your Player ID {#your-player-id}

The `onChange` function provides the client's player ID as `yourPlayerId`. This can be used to find their own info using the `getPlayerInfo()` function described above.

:::tip
Importantly, `yourPlayerId` will be undefined if the client is a spectator!
