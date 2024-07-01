---
sidebar_position: 99
---

# API Reference

Dusk methods for writing multiplayer games. The SDK is split into two parts:

- **Game logic**, this code needs to be located in a file called `logic.js`
- **UI integration**, that can live anywhere, but the docs will refer to `client.js`

## Game logic {#game-logic}

### `Dusk.initLogic(options)` {#duskinitlogicoptions}

The `initLogic` function should be called directly at the top level of your `logic.js` file. This should contain all logic required to control your game state and handle player life cycle events. All options except `events` are required. Example:

```js
// logic.js
Dusk.initLogic({
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
        throw Dusk.invalidAction()
      }

      // Increase score and switch turn
      game.scores[playerId]++
      //Switch turn
      game.currentPlayerIndex = (game.currentPlayerIndex + 1) % allPlayerIds.length;
      game.currentPlayerStartedAt = Dusk.gameTimeInSeconds();
      // Determine if game has ended
      if (isVictoryOrDraw(game)) {
        Dusk.gameOver({
          everyone: 100,
        })
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
    if (Dusk.gameTimeInSeconds() - game.lastPlayerScoredAt > 30) {
      game.currentPlayerIndex = (game.currentPlayerIndex + 1) % allPlayerIds.length;
      game.currentPlayerStartedAt = Dusk.gameTimeInSeconds();
    }
  },
  updatesPerSecond: 10,
  inputDelay: 30,
  landcape: false,
  persistPlayerData: false,
})
```

#### `minPlayers: number` {#minplayers-number}

A value between 1-4 of the minmum amount of players that is required to play the game. See [Joining and Leaving](advanced/joining-leaving.md#minimum-and-maximum-players).

#### `maxPlayers: number` {#maxplayers-number}

A value between 1-4, must be equal to or greater than `minPlayers`. If the value is lower than 4, other users may join the game as spectators. See [Joining and Leaving](advanced/joining-leaving.md#minimum-and-maximum-players).

#### `setup(allPlayerIds: string[]): any` {#setupallplayerids-string-any}

The `setup` function returns the initial values for the game state, which is the game information that’s synced across players. The function gets the `allPlayerIds` argument which is an array of the player IDs at the time of starting the game and must return the initial game state.

#### `actions: { [string]: (payload, { game: object, playerId: string, allPlayerIds: string[] }) => void}` {#actions--string-payload--game-object-playerid-string-allplayerids-string---void}

The `actions` option is an object with actions functions exposed to the UI integration layer, called with [`Dusk.actions.myAction(payload)`](#duskactionspayload). The functions are responsible for [validating the action](#duskinvalidaction), mutating the `game` state and [end the game](#duskgameover) when appropriate.

#### `events: { playerJoined? | playerLeft?: (playerId: string, { game: any, allPlayerIds: string[] }) => void }` _optional_ {#events--playerjoined--playerleft-playerid-string--game-any-allplayerids-string---void}

By default a game will end if a player leaves (see [Joining and Leaving](advanced/joining-leaving.md#minimum-and-maximum-players)), but by defining the `playerJoined`/`playerLeft` events you can [Support Players Joining Midgame](advanced/joining-leaving.md#supporting-players-joining-midgame).

#### `update({game: object,  allPlayerIds: string[]}) => void` _optional_ {#updategame-object--allplayerids-string--void}

Function that is executed every second. See [Using Time in your Game](advanced/real-time-games.md#update-function).

#### `updatesPerSecond?: number` {#updatespersecond-number}

How many times `update` function should be executed per second. Allowed values 1-30. Default 1. See  [Real-Time Games](advanced/real-time-games.md).

#### `inputDelay?: number` {#inputdelay-number}

How many milliseconds user action is delayed before run locally. Allowed values 0-250. Default value 25. Higher values will mean that players are more in sync with each other (i.e. fewer rollbacks), but will feel less snappy locally as it takes longer for a player's actions to be reflected on their screen.

### `landscape?: boolean` {#landscape-boolean}

Setting `landscape` to true will make your game appear in landscape orientation. A game can only be in portrait or landscape mode.

### `persistPlayerData?: boolean` {#persistplayerdata-boolean}

Setting `persistPlayerData` to true will enable storing player data across game sessions. Check out [Persisted Data](advanced/persisted-data.md).

### `reactive?: boolean` ${#reactive-boolean}

Default `true`. Setting `reactive` to false will improve game logic performance, but disable referential equality in game state passed to `onChange` callback (e.g. `game`).

### `Dusk.invalidAction()` {#duskinvalidaction}

Whenever a player tries to do an action that is not allowed, the action handler should reject it by calling `throw Dusk.invalidAction()` which will cancel the action and roll back any local optimistic updates.

This is completely safe to do and can be used throughout your game. For instance, it is used in the [Tic Tac Toe example](https://github.com/dusk-gg/dusk/blob/staging/examples/tic-tac-toe/logic.js) to ensure that players only can make a move when it is their turn.

```js
// logic.js
Dusk.initLogic({
  actions: {
    myAction: (payload, { game, playerId }) => {
      if (!isValidAction(payload)) {
        throw Dusk.invalidAction()
      }
    },
  },
})
```

### `Dusk.gameOver(options)` {#duskgameoveroptions}

When the game has ended, the action handler should call `Dusk.gameOver`. Your game doesn't need to show a "game over" screen. Dusk overlays a standardized game over popup to the user. See more in the [Game Over](advanced/game-over.md) guide.

```js
// logic.js
Dusk.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      if (isGameOver(game)) {
        const winner = getWinner(game)
        const loser = getLoser(game)

        Dusk.gameOver({
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

:::info

Only one of `players` and `everyone` can be provided at the same time.

:::

#### `players: Record<string, "WON" | "LOST" | "TIE" | number>` {#players-game-over}

`players` is an object with player IDs as keys and the game result as values. The game result for each player can be `WON`/`LOST`/`TIE` or an integer score (higher is better) score. Mixing `WON`/`LOST`/`TIE` and scores at the same time is not allowed. All players present in the game at the moment the game ends must be mentioned in the `players` object.

####  `everyone: "WON" | "LOST" | "TIE" | number` {#everyone-game-over}

`everyone` allows to assign the same result for every player. Providing a score value shows a team score game over popup.

### `minimizePopUp?: boolean` {#minimizepopup-boolean}

Set to `true` if you want to show the game over popup as a small bar at the bottom of the screen. This is useful if your game has its own custom end game state.

#### `delayPopUp?: boolean` {#delaypopup-boolean}

Optional. Set to `true` if you want to instruct Dusk to delay showing of the game over popup until you call `Dusk.showGameOverPopUp()`.

### `Dusk.gameTime()` {#duskgametime}

Returns the amount of milliseconds that have passed since the start of the game. See [Using Time in your Game](advanced/real-time-games.md#game-time).

## Client {#client}

### `Dusk.initClient(options)` {#duskinitclientoptions}

The `initClient` function should be called after your game is fully ready, but should not start the actual gameplay until `onChange` is called.

```js
// client.js
Dusk.initClient({
  onChange: ({
    game,
    previousGame,
    futureGame,
    yourPlayerId,
    players,
    allPlayerIds,
    action,
    event,
    rollbacks,
  }) => {
    render(game)
  },
})
```

#### `onChange: () => void` {#onchange---void}

##### `game: object` {#game-object}

This argument is the current game state. Your `onChange()` function should update the UI to reflect its values.

##### `previousGame: object` {#previousgame-object}

This argument is the previous game state. Usually this can be ignored, but it's useful if your game needs to detect changes of certain values.

##### `futureGame?: object` {#futuregame-object}

This argument is the predicted future game state. This value is only available if game uses `update` function. Used only in cases, where the game wants to do interpolation. See [Reducing Stutter](advanced/reducing-stutter.md).

##### `yourPlayerId?: string` {#yourplayerid-string}

Your player id, if the current user is a spectator this argument is undefined.

##### `players: Record<string, { playerId: string, displayName: string, avatarUrl: string }>` {#players-recordstring--playerid-string-displayname-string-avatarurl-string-}

*Deprecated:* Use [allPlayerIds](#all-player-ids) and [Dusk.getPlayerInfo](#dusk-get-player-info)

The `players` argument is an object of the current players, useful to display their names and avatars in the game.

##### `allPlayerIds?: string[]` {#all-player-ids}

The player IDs of all current players in the game.

##### `action?: { name: string, playerId: string, params: any }` {#action--name-string-playerid-string-params-any-}

If the update was triggered from a `Dusk.actions.*` call, this argument will contain info about it, such as the payload and who initiated. Usually this should be ignored and rely on `game` instead.

##### `event?: { name: string, params: any }` {#event--name-string-params-any-}

Possible events: `playerJoined`, `playerLeft`, `stateSync`, `update`, `timeSync`.

### `Dusk.actions.*(payload)` {#duskactionspayload}

All functions passed in the `actions` object in `Dusk.initLogic()` will be exposed to the client via `Dusk.actions.myActionName`. This is the only way game state may be updated to make sure it's propagated to every player. You may call it with one argument of any type, but usually an object is recommended.

```js
// client.js
button.onClick = () => {
  Dusk.actions.markCell({
    myId: "button",
  })
}
```

### `Dusk.showGameOverPopUp()` {#duskshowgameoverpopup}

If you set `delayPopUp` to `true` in `Dusk.gameOver()`, you should call this function in your `client.js` to show the game over popup.

### `Dusk.showInvitePlayers()` {#duskshowinviteplayers}

Opens invite modal inside the Dusk app. Useful if you want to incentivize players to invite their friends.

### `Dusk.gameTime()` {#duskgametime-1}

Returns the amount of milliseconds that have passed since the start of the game. See [Using Time in your Game](advanced/real-time-games.md#game-time).

### `Dusk.getPlayerInfo(playerId)` {#dusk-get-player-info}

Returns name, avatar, etc. for the player. Note that you can pass the ID of a player that is no longer in game and get placeholder information.

### `Dusk.timeSinceLastUpdate()` {#dusktimesincelastupdate}

Returns the amount of milliseconds that have passed since the last `update` call. Can be used to smoothly render timers or interpolate between two positions.

### `Dusk.msPerUpdate` {#duskmsperupdate}

Number of milliseconds indicating how often `update` function is called. Only available if game uses updates.

### `Dusk.interpolator()` {#duskinterpolator}

Returns an instance of interpolator. See [Reducing Stutter](advanced/reducing-stutter.md).

### `Dusk.interpolatorLatency()` {#duskinterpolatorlatency}

Returns an instance of interpolator. See [Reducing Stutter](advanced/reducing-stutter.md).
