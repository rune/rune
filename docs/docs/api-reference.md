---
sidebar_position: 99
---

# API Reference

Rune methods for writing multiplayer games. The SDK is split into two parts:

- **Game logic**, this code needs to be located in a file called `logic.js`
- **UI integration**, that can live anywhere, but the docs will refer to `client.js`

## `Rune.initLogic(options)`

The `initLogic` function should be called directly at the top level of your `logic.js` file. This should contain all logic required to control your game state and handle player life cycle events. All options except `events` are required. Example:

```js
// logic.js
Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const scores = {}
    for (let playerId of allPlayerIds) {
      scores[playerId] = 0
    }
    return { scores, currentPlayerIndex: 0, currentPlayerStartedAt: 0 }
  },
  actions: {
    myAction: (payload, { game, playerId, allPlayerIds }) => {
      // Check it's not the other player's turn
      if (game.currentPlayer !== allPlayerIds[game.currentPlayerIndex]) {
        throw Rune.invalidAction()
      }

      // Increase score and switch turn
      game.scores[playerId]++
      //Switch turn
      game.currentPlayerIndex = (game.currentPlayerIndex + 1) % allPlayerIds.length;
      game.currentPlayerStartedAt = Rune.gameTimeInSeconds();
      // Determine if game has ended
      if (isVictoryOrDraw(game)) {
        Rune.gameOver()
      }
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      game.scores[playerId] = 0
    },
    playerLeft: (playerId, { game }) => {
      delete game.scores[playerId]
    },
  },
  update: ({ game, allPlayerIds }) => {
    //If 30 seconds have passed since last player scored, switch player
    if (Rune.gameTimeInSeconds() - game.lastPlayerScoredAt > 30) {
      game.currentPlayerIndex = (game.currentPlayerIndex + 1) % allPlayerIds.length;
      game.currentPlayerStartedAt = Rune.gameTimeInSeconds();
    }
  }
})
```

### `minPlayers: number`

A value between 1-4 of the minmum amount of players that is required to play the game. See [Joining and Leaving](advanced/joining-leaving.md#minimum-and-maximum-players).

### `maxPlayers: number`

A value between 1-4, must be equal to or greater than `minPlayers`. If the value is lower than 4, other users may join the game as spectators. See [Joining and Leaving](advanced/joining-leaving.md#minimum-and-maximum-players).

### `setup(allPlayerIds: string[]): any`

The `setup` function returns the initial values for the game state, which is the game information that’s synced across players. The function gets the `allPlayerIds` argument which is an array of the player IDs at the time of starting the game and must return the initial game state.

### `actions: { [string]: (payload, { game: any, playerId: string, allPlayerIds: string[] }) => void}`

The `actions` option is an object with actions functions exposed to the UI integration layer, called with [`Rune.actions.myAction(payload)`](#runeactionspayload). The functions are responsible for [validating the action](#runeinvalidaction), mutating the `game` state and [end the game](#runegameover) when appropriate.

### `events: { playerJoined? | playerLeft?: (playerId: string, { game: any, allPlayerIds: string[] }) => void }` _optional_

By default a game will end if a player leaves (see [Joining and Leaving](advanced/joining-leaving.md#minimum-and-maximum-players)), but by defining the `playerJoined`/`playerLeft` events you can [Support Players Joining Midgame](advanced/joining-leaving.md#supporting-players-joining-midgame).

### `update({game: any,  allPlayerIds: string[]}) => void` _optional_

Function that is executed every second. See [Using Time in your Game](advanced/real-time-games.md#update-function).

## `Rune.invalidAction()`

Whenever a player tries to do an action that is not allowed, the action handler should reject it by calling `throw Rune.invalidAction()` which will cancel the action and roll back any local optimistic updates.

This is completely safe to do and can be used throughout your game. For instance, it is used in the [Tic Tac Toe example](https://github.com/rune/rune-games-sdk/blob/staging/examples/tic-tac-toe/logic.js) to ensure that players only can make a move when it is their turn.

```js
// logic.js
Rune.initLogic({
  actions: {
    myAction: (payload, { game, playerId }) => {
      if (!isValidAction(payload)) {
        throw Rune.invalidAction()
      }
    },
  },
})
```

## `Rune.gameOver(options)`

When the game has ended, the action handler should call `Rune.gameOver`. Your game doesn't need to show a "game over" screen. Rune overlays a standardized game over popup to the user. See more in the [Game Over](how-it-works/game-over.md) guide.

```js
// logic.js
Rune.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      if (isGameOver(game)) {
        const winner = getWinner(game)
        const loser = getLoser(game)

        Rune.gameOver({
          players: {
            [winner.playerId]: "WON",
            [loser.playerId]: "LOST",
          },
          delayPopUp: true,
        })
      }
    },
  },
})
```

## `Rune.gameTimeInSeconds()`

Returns the amount of seconds that have passed since the start of the game. See [Using Time in your Game](advanced/real-time-games.md#game-time).

### `players: Record<string, "WON" | "LOST" | number>`

`players` is an object with player IDs as keys and the game result as values. The game result for each player can be either `WON`/`LOST` or an integer score (higher is better) score. Mixing `WON`/`LOST` and scores at the same time is not allowed. All players present in the game at the moment the game ends must be mentioned in the `players` object.

### `delayPopUp?: boolean`

Optional. Set to `true` if you want to instruct Rune to delay showing of the game over popup until you call `Rune.showGameOverPopUp()`.

## `Rune.showGameOverPopUp()`

If you set `delayPopUp` to `true` in `Rune.gameOver()`, you should call this function in your `client.js` to show the game over popup.

## `Rune.initClient(options)`

The `initClient` function should be called after your game is fully ready, but should not start the actual gameplay until `onChange` is called.

```js
// client.js
Rune.initClient({
  onChange: ({
    game,
    previousGame,
    yourPlayerId,
    players,
    action,
    event,
    rollbacks,
  }) => {
    render(game)
  },
})
```

### `onChange: () => void`

#### `game: any`

This argument is the current game state. Your `onChange()` function should update the UI to reflect its values.

#### `previousGame: any`

This argument is the previous game state. Usually this can be ignored, but it's useful if your game needs to detect changes of certain values.

#### `yourPlayerId?: string`

Your player id, if the current user is a spectator this argument is undefined.

#### `players: Record<string, { playerId: string, displayName: string, avatarUrl: string }>`

The `players` argument is an object of the current players, useful to display their names and avatars in the game.

:::caution

Do not rely on `players` argument for determining player order, instead use `setup` and `events.playerJoined/playerLeft` callbacks in `logic.js`.

:::

#### `action?: { name: string, playerId: string, params: any }`

If the update was triggered from a `Rune.actions.*` call, this argument will contain info about it, such as the payload and who initiated. Usually this should be ignored and rely on `game` instead.

#### `event?: { name: string, params: any }`

Currently this is always the `stateSync` event, you can ignore it for now.

## `Rune.actions.*(payload)`

All functions passed in the `actions` object in `Rune.initLogic()` will be exposed to the client via `Rune.actions.myActionName`. This is the only way game state may be updated to make sure it's propagated to every player. You may call it with one argument of any type, but usually an object is recommended.

```js
// client.js
button.onClick = () => {
  Rune.actions.markCell({
    myId: "button",
  })
}
```
