---
sidebar_position: 65
---

# Persisted Data

Many games benefit from storing player data across play sessions such as map progress, items, and various game-specific data. Rune makes it easy to define and store such data. 

To enable persistence, you set `persistPlayerData: true` in `Rune.initLogic()`:

```js
Rune.initLogic({
    persistPlayerData: true,
    // ... remaining arguments
})
```

## Storing Player Data {#loading-and-saving-data}

Rune automatically loads and saves player data. You just need to decide what game data should be persisted across play sessions. To persist data for a player, store it in `game.persisted[playerId]`. The `game.persisted` object will always be available and contain all active players in the game. Each player has an object that you can store data in (incl. deep nested data). Any data you store in `game.persisted` will be persisted regardless of whether the game ends, is restarted, the player leaves, etc.

Here's an example of using `game.persisted` for incrementing the number of sessions the player has played your game.

```js
Rune.initLogic({
    persistPlayerData: true,
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
    persistPlayerData: true,
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

The [Dev UI](../playtesting/simulating-multiplayer.md) provides a way to see and manipulate `game.persisted` so you can test that your game works across game sessions as intended. For instance, you can set one of the players' levels to 99 and check that it works fine when another new player joins as level 1.   

If you decide to test persistence using the app, be aware that in review/draft games behave differently to published games.
The game will be loaded with persisted data from the last available active game version (if there is any). But no data will be saved.
This will guarantee that even if in review version has issues, it will not impact your experience in the published version.

## TypeScript Support {#typescript-support}

You can provide a `Persisted` type to `RuneClient` to specify what you're storing in `game.persisted`.

```typescript
// ... other types

type Persisted = {
  sessionCount: number
  inventory: Item[]
}

declare global {
  const Rune: RuneClient<GameState, GameActions, Persisted>
}

```

## Example Games {#example-games}

Here's some games to get inspired for how to make use of persistence:

- [Cube Rush](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/cube-rush) stores best time the player has achieved
- [Sudoku](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/sudoku) stores play sessions to decide whether to show onboarding
- [Pinpoint](https://github.com/rune/rune-multiplayer-web-games/tree/staging/examples/pinpoint) stores play sessions to decide whether to show onboarding


## Future Plans

This is just the start. We're working on adding ways for you to easily submit scores to automatically generate leaderboards so players can compete to be the best at your game. Similarly, we'll also add achievements that players can earn inside your game and show off on their profile!  
