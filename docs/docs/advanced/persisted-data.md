---
sidebar_position: 65
sidebar_class_name: hidden
---

# Persisted Data (WIP)

:::caution
This page is written to start a discussion. This API is not yet implemented.
:::

Many games benefit from storing player data across play sessions such as map progress, items, and various game-specific data. Rune makes it easy to define and store such data.

## Storing Player Data {#loading-and-saving-data}

Rune automatically loads and saves player data. You just need to decide what game data should be persisted across play sessions. To persist data for a player, store it in `game.persisted[playerId]`. The `game.persisted` object will always be available and contain all active players in the game. Each player has an object that you can store data in (incl. deep nested data). Any data you store in `game.persisted` will be persisted regardless of whether the game ends, is restarted, the player leaves, etc.

Here's an example of using `game.persisted` for incrementing the number of sessions the player has played your game.

```js
Rune.initLogic({
    setup: (allPlayerIds, { game }) => {
        for (const playerId of allPlayerIds) {
            game.persisted[playerId].sessionCount = (game.persisted[playerId].sessionCount || 0) + 1
        }
        // ... remaining setup code
    },
    playerJoined(playerId, { game }) => {
        // update count for any players joining during the game
        game.persisted[playerId].sessionCount = (game.persisted[playerId].sessionCount || 0) + 1
    },
    // ... remaining arguments
})
```

You can also modify `game.persisted` inside actions and in the `update()` loop. For instance, here's an example of collecting a health potion and using it.

```js
Rune.initLogic({
    actions: {
        pickUpItem: (droppedItemId, { game, playerId }) => {
            game.persisted[playerId].inventory.push(game.droppedItems[droppedItemId])
        },
        useItem: (inventoryId, { game, playerId }) => {
            game.persisted[playerId].inventory[inventoryId] = undefined
            game.playerHealth[playerId] += 100
        }
    },
    // ... remaining arguments
})
```

If the player didn't use the health potion, then they'd automatically have it in their persisted data for their next game session. The persisted data can be up to 100 kb of JSON-serializable data per player.

## Backwards Compatibility {#backwards-compatibility}

Rune persists data forever, also across game versions. Your game might see a player in `game.persisted` with 1-year-old data saved many game versions ago. We recommend using TypeScript, storing types used in old game versions, and assuming in your logic that all persisted keys can be undefined.

:::caution
You should be very careful to ensure your game doesn't break if it encounters old data!
:::


## Testing Persistence {#testing-persistence}

The [Dev UI](../publishing/simulating-multiplayer.md) provides a way to see and manipulate `game.persisted` so you can test that your game works across game sessions as intended. For instance, you can set one of the players' levels to 99 and check that it works fine when another new player joins as level 1.   

In addition, everyone on your team can [playtest your game](../publishing/collaboration.md) while in draft/review inside the Rune app. When playtesting, all players start afresh and any persisted data is only saved for that game version. Players can play that game version multiple times to test the persisted data.

## Example Games {#example-games}

Here's some games to get inspired for how to make use of persistence:

- [Cube Rush](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/cube-rush) stores best time the player has achieved
- [Sudoku](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/sudoku) stores play sessions to decide whether to show onboarding
- [Pinpoint](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/pinpoint) stores play sessions to decide whether to show onboarding


## Future Plans

This is just the start. We're also working on adding a way for you to submit scores for leaderboards that'll be shown both inside and outside your game! Similarly, we'll add achievements that players can earn inside your game and show off on their profile externally.  
