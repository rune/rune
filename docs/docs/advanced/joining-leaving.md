---
sidebar_position: 50
---

# Joining and Leaving

One complexity of multiplayer games is that there may be different number of players, people joining/leaving, etc. Rune handles this complexity by default by automatically making additional people in the room spectators and so on. If you want and your game supports it, you can opt-in to handling more of this complexity.

# Events

Rune has `events`, which are always triggered based on room changes (e.g. a player joining). This is opposed to `actions` , which are always called by game. Currently available events are: `playerJoined`, `playerLeft`, `stateSync`, `update`, `timeSync`. You can read more about `update` and `timeSync` events in [time documentation](using-time-in-your-game.md)

Whenever an event happens, `onChange` is called with `event` as a parameter to let the game visually change its appearance based on the changes. The game can provide an optional callback for `playerJoined` and `playerLeft` in `logic.js`, which allows the game to change game state when they happen.

Below is an overview comparing actions & events.

|                       | Actions    | Events                     |
| --------------------- | ---------- |----------------------------|
| Defined and called by | Game Dev   | Rune                       |
| Quantity              | Any number | Predefined (currently 5)   |
| Update game state?    | Yes        | If using optional callback |
| Might be rolled back? | Yes        | No                         |

## Spectating

Many games only support a few players. The remaining users in the room will be spectactors. Spectators are:

- Running game code as everyone else, i.e. calls `onChange` on new actions/events
- Unable to make any actions (enforced by the SDK)
- Not triggering `playerJoined` or `playerLeft` events
- Not provided in `players` argument to `onChange`
- Shown differently in the room UI
- Has `yourPlayerId: undefined` argument for `onChange`

This means that the number of players that the game SDK sees may not equal the number of users in the room. This is intended.

## Minimum and Maximum Players

As an argument to `initLogic()` , the game provides `minPlayers`, which is an int from 1 to 4. For instance, chess would specify `minPlayers: 2`. The game cannot be started with fewer players.

If a player leaves and the game drops below `minPlayers`, the game will end. If the game provides a `playerLeft` callback, it may specify a winner among the remaining players using `Rune.gameOver()`. Note that the `playerLeft` callback must be provided to [support players leaving midgame](joining-leaving.md) anyway.

Similar to `minPlayers`, the game provides `maxPlayers`. When anyone joins the room beyond two players, they automatically become a spectator.

## Supporting Players Joining Midgame

Imagine a card-game like Hearts, where all the cards are dealt at the beginning of the game. It wouldn’t make sense for a player to join the gameplay after the cards have been dealt as they wouldn’t be able to receive any cards. Instead they should join as a spectator, waiting for the game to finish. This is the default behavior for any game. Restarting the game or changing the game will make the late joiners become players (assuming they’re below `maxPlayers` threshold).

The game can provide a `playerJoined` callback in `initLogic()` to make it clear that they support players dynamically joining. This can be useful for e.g. collaborative crosswords or an open world exporation game like Minecraft, where the players are quite independent.

For instance, the game may want to initialize a player’s score as part of handling dynamic joins:

```jsx
Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const scores = {}
    for (playerId in allPlayerIds) {
      scores[playerId] = 0
    }
    return { scores }
  },
  actions: ...,
  events: {
    playerJoined: (playerId, { game }) => {
      game.scores[playerId] = 0
    }
  }
})
```

## Supporting Players Leaving Midgame

Continuing the example of the card-game Hearts, it’s quite complex to decide what should happen if a player leaves. By default, Rune will end the game. Players can then restart or choose an new one from the game selection.

The game can provide a `playerLeft` callback in `initLogic()` to make it clear that they support players dynamically leaving. The callback will “clean up” the game state and let the game continue for the remaining players. For games with turns, the game should skip the turn if it’s the turn of the player who left.

A player will only be determined as having left the game once they leave the room. This means that if one of the players’ connection broke, they have 30 seconds to reconnect. Having a timeout like this lets the game go on if someone is losing internet connection for good.

## Moving to Spectator and Back

Users who are currently playing may want to just listen in and not participate in the gameplay. For instance, they may want to grab food / do homework while others play. They should be able to make themselves a spectator. This will trigger a `playerLeft` event and the game will remove that player from the game.

If they at a later time want to rejoin the same ongoing game, they can do that through the UI as well (assuming the game supports dynamic joins and the game is not at `maxPlayers`). Rejoining the game triggers `playerJoined` and they would start afresh in the same state as any other new players joining the game.
