---
sidebar_position: 65
sidebar_class_name: hidden
---

# Persisted Data (WIP)

:::caution
This page is written to start a discussion. This API is not yet implemented.
:::

Many games benefit from storing player data across play sessions such as high scores, items, and various game-specific data. Rune makes it easy to define and store such data.   

## Loading and Saving Data {#loading-and-saving-data}

Persisted player data is loaded on game start and available in the `setup` function through the `persistedPlayers` object. Similarly, it's also available for players joining midway triggering the  `playerJoined` callback.

Your game can persist data when players leave by passing a `persistPlayer` function to `Rune.initLogic()`. This data will always be persisted regardless of whether the game ends, is restarted, or the player leaves. You can be confident that this data will always be saved.   

Here's an example for incrementing the number of sessions playing that game.

```js
Rune.initLogic({
    setup: (allPlayerIds, { persistedPlayers }) => {
        const game = { sessionCounts: {} }
        for (const playerId of allPlayerIds) {
            game.sessionCounts[playerId] = persistedPlayers.sessionCount || 0
        }
        return game
    },
    playerJoined(playerId, { game, persistedPlayer }) => {
        game.sessionCounts[playerId] = persistedPlayer.sessionCount || 0
    },
    persistPlayer(playerId, { game, persistedPlayer }) => {
        persistedPlayer.sessionCount = game.sessionCounts[playerId] + 1
    },
    // remaining arguments
})
```

This persisted data can be up to 100 kb of JSON-serializable data per player.

## Scores and Leaderboards {#scores-and-leaderboards}

Players enjoy seeing their progress on their profiles and competing on leaderboards. Your game can use the `persistedPlayer.submitHighScore()` function to tell Rune about the player's score. Rune will now automatically create leaderboards for your game inside the Rune app!

It's highly game-specific how the leaderboard should be shown and ranked. You can provide the `leaderboard` key with e.g. `lowestScore` to specify that lower scores are better. See the [API reference](../api-reference.md) for all the options. The `leaderboard` key is also used for sorting the leaderboard when calling `Rune.gameOver()`. The default is `highestScore`.

Additionally, games may want to show multiple leaderboards split out by difficulty or map/level. Your game can provide a level definition like `easy` (see [options here](../api-reference.md)) or a map number. Rune will then assign that high score to a separate leaderboard.

Here's an example for a racing game with a leaderboard for each map.

```js
Rune.initLogic({
    persistPlayer(playerId, { game, persistedPlayer }) => {
        persistedPlayer.submitHighScore(game.scores[playerId], game.mapNumber)
    },
    leaderboard: "lowestTime",
    // remaining arguments
})
```

The `submitHighScore()` function will only update the high score if it's a better score than the previous score so you don't have to keep track.

## Backwards Compatibility {#backwards-compatibility}

Rune persists data forever, also across game versions. Your game might see a `persistedPlayer` with 1-year-old data saved many game versions ago. We recommend using TypeScript, storing types used in old game versions, and assuming in your logic that all persisted keys can be undefined.

:::caution
You should be very careful to ensure your game doesn't break if it encounters old data!
:::
 

## Testing Persistence {#testing-persistence}

The [Dev UI](../publishing/simulating-multiplayer.md) provides a way to input a data payload for `persistedPlayer` so you can test that your game works as intended. It also allows you to see what the outcome of `persistPlayer()` would be at any moment. 

In addition, everyone on your team can [playtest your game](../publishing/collaboration.md) while in draft/review inside the Rune app. When playtesting, all players start afresh and any persisted data is only saved for that game version. Players can play that game version multiple times to test the persisted data. High scores achieved during playtesting will not be saved or shown on the leaderboards.

## Example Games {#example-games}

Here's some games to get inspired for how to make use of persistence:

- [Cube Rush](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/cube-rush) submits high scores for the leaderboard
- [Sudoku](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/sudoku) stores play sessions to decide whether to show onboarding
