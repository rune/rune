# Rune Game Development Guide

## Core Concepts

- Rune is a platform for multiplayer mobile games with voice chat
- Games only run on mobile devices with touch controls (no keyboard controls)
- Screen size is fixed once game starts (no resize/orientation change handling needed)
- Default orientation is portrait mode, can be set to landscape via `landscape: true` in `Rune.initLogic()`
- Always use the check-rune-project-errors tool after making changes

## Server-Side Logic Requirements

Rune runs game logic on both clients and server, requiring deterministic code in `logic.js`:

### Prohibited in logic.js:

- External variable mutation/assignment
- Async/await syntax (logic must be synchronous)
- Try/catch blocks (throwing errors is allowed)
- Eval statements
- This keyword
- Non-deterministic functions (Date, fetch, etc.)
- Regular expressions

## Game State Architecture

The Rune SDK will help check your code for unsafe patterns such as:

- Mutation and assignment of variables outside of current function scope
- `async`/`await` syntax as logic must be synchronous
- `try`/`catch` syntax as this can interfere with SDK logic (throwing is still allowed)
- `eval` because it's potentially harmful and can be used to bypass other rules
- `this` keyword as it allows classes to have hidden side effects
- Non-deterministic runtime built-ins such as `Date` and `fetch`
- Regular expressions because they are stateful

A notable exception to this list is `Math.random()` which Rune makes deterministic.

The Rune CLI will also warn you if it detects that your game logic seems to be using potentially unsafe code when uploading. Don't worry, we'll also help ensure that your game runs smoothly across devices when testing it before it's released.

## Why this approach using deterministic code? {#why-this-approach-using-deterministic-code}

Because it's the future! 😎 All modern multiplayer engines use predict-rollback netcode with deterministic physics. For instance, Rocket League and Mortal Combat both use this approach. It's how you make great multiplayer games that work even in bad network conditions.

Rune's predict-rollback approach is extremely bandwidth-efficient as only the action payloads are sent between clients and server, not the entire game state. Clients can also simulate the world ahead of the server, which makes real-time games possible even on bad mobile internet with frequent latency spikes. This is all done by having the exact same deterministic game logic running on both the clients and the server.

## External Dependencies {#external-dependencies}

You can import external dependencies in your game logic, e.g. for physics or pathfinding. Many external libraries contain code that have unintended side effects and thus does not comply with constraints listed above. For that reason Rune has a list of known supported libraries:

- rune-sdk
- sudoku-gen
- toglib

In case you use a library that's not on the supported libraries list, you'll receive a warning in CLI during development. If you build the game and successfully upload it to Rune, we would appreciate if you add the dependencies to the list linked above.

## Editor Integration {#editor-integration}

Rune has created an eslint plugin to give warnings for potentially unsafe code directly in your editor! If you're using the Rune quickstart template created using `npx rune@latest create`, then this eslint plugin is already set up for you. If not, then follow the steps below.

Add the plugin to your `eslint.config.mjs` configuration file:

```js
import runePlugin from "rune-sdk/eslint.js"

...
export default [
   //other config
   //...

   ...runePlugin.configs.recommended,
]
```

That's it. Your logic code will now be linted to detect potentially unsafe code and prevent desyncs! 🧙‍♂️

By default, the plugin will check files named `logic.js`/`logic.ts` or files in a `logic` folder for the Rune SDK rules. If needed, you can specify more files to lint yourself with:

```js
import runePlugin from "rune-sdk/eslint.js"

export default [
  {
    files: ["**/logic.ts", "**/logic.js"],
    ...runePlugin.configs.logicModuleConfig,
  },
]
```

# Syncing Game State

Underlying all multiplayer gaming is syncing game information. This page will use the simple example of Tic Tac Toe to explain how the game state is synced across players using Rune's custom predict-rollback netcode.

## Separation into Game Logic and Rendering {#separation-into-game-logic-and-rendering}

Multiplayer games are generally separated into game logic and rendering. This separation has many benefits, including being able to run dedicated servers that only have game logic. Rune multiplayer games are also separated into logic and rendering.

### Game Logic {#game-logic}

The logic is stored in a single file, `logic.js`, and initialized by running `Rune.initLogic()` with `minPlayers`, `maxPlayers`, `setup` and `actions`. The `minPlayers` and `maxPlayers` values ensure the game only have to consider a number of players between those two values. All other cases are Rune, incl. automatically making remaining people in the room spectators.

The `setup` function returns the initial values for the `game` state, which is the game information that’s synced across players. In the case of Tic Tac Toe, the `game` state describes who’s turn it is and which of the 9 cells have been filled with an X or an O. The `setup` function gets the `players` argument with info about the players at the time of starting the game.

The player can perform one of the `actions` to modify the game state. An `action` is a function that take as input an object with arguments. The function is also provided the `game` state and `playerId` containing the ID of the player, who performed the action. In the case of Tic Tac Toe, the only needed `action` is to mark a cell with an X or O. The Rune SDK
limits the number of times that an action can be called to 10 per second per player, so you should be sure to throttle your actions if it is possible for them to be triggered more frequently than that.

Only `logic.js` file can modify the `game` state. The `setup` and `actions` functions cannot make use of any data from outside of their function definition and can’t modify anything outside the function definition (i.e. they’re pure functions w/o side effects).

The remaining parts of the code are hopefully self-explanatory. Some code like the `isVictoryOrTie` function is left out as it’s not important in this context.

```js
Rune.initLogic({
  minPlayers: 1 - 6, // <= maxPlayers
  maxPlayers: 1 - 6, // >= minPlayers
  landscape: true, // Optional, default is false
  setup: () => {
    return {
      // Initial game state
    }
  },
  actions: {
    markCell: ({ cellId }, { game, playerId }) => {
      // Check it's not the other player's turn and unmarked cell
      if (game.lastPlayerTurn !== playerId || game.cells[cellId]) {
        throw Rune.invalidAction()
      }

      // Update cell and switch turn
      game.cells[cellId] = playerId
      game.lastPlayerTurn = playerId

      // Determine if game has ended
      const winner = isVictoryOrTie(game)
      if (winner !== undefined) {
        Rune.gameOver()
      }
    },
  },
})
```

### Client Rendering (`client.js`)

```js
const onChange = ({
  previousGame,
  game,
  action,
  event,
  players,
  yourPlayerId,
  rollbacks,
}) => {
  // TODO: Update animations, graphics, UI, sound effects
}

Rune.initClient({ onChange })
```

## High-Level Game Syncing Flow {#high-level-game-syncing-flow}

Rune does a lot of magic behind the scenes to sync the game state. Here’s a simplified overview of how it works:

1. A client performs an `action` by interacting with the game (e.g. clicking a cell in Tic Tac Toe). The client optimistically updates `game` state by calling the associated `action` function (i.e. `clickCell` in the case of Tic Tac Toe) and calls `onChange` to update the graphics etc.
2. The `action` is immediately sent to the server. The server runs the associated `actions` function provided by the game, thereby checking that the `action` is valid and whether the game ends.
3. If the `action` is valid, the server updates its groundtruth `game` state and sends the `action` out to all connected clients. If the `action` is not valid, it’s ignored.
4. Each client computes the new `game` state using the `action` payload and the associated function in `actions`. It’s much cheaper bandwidth-wise to send the `action` than the entire `game` state. The client who sent the `action` will also receive the same `action` payload from the server as an acknowledgement message.

## Restrictions {#restrictions}

- Game logic must be written in a subset of JavaScript. The client rendering the game can use anything.
- Max 10 actions per player per second.
- Actions must be synchronous, execute in <10 ms and consume <1 MB memory.
- The `onChange` function must be synchronous. It may trigger async functions if needed, but cannot `await` them.
- The `game` state must be <1 MB and any `action` payload below <25 KB to avoid unnecessary network bandwidth usage.
- The `game` state must be JSON-serializable (e.g. no classes / functions / self-references) so it can be sent over the network.
- The logic.js file must be <1 MB as it will be fetched by the server and run inside a VM.

These restrictions are necessary to make great multiplayer games using predict-rollback netcode.

## StateSync Event {#statesync-event}

Games running on Rune should support initializing the game at any possible moment as someone can join as a spectator/player at any time. This could happen e.g. at the start of the game, in the middle of a match, or after game over. This initialization is done using the `stateSync` event. Additionally, the `stateSync` event is also used when restarting the game, reconnecting after an unexpected disconnect, or if the game crashes.

Your game must support this `stateSync` event. If you built your game in a reactive way (i.e. it always rerenders according to `onChange`'s `game` argument), then you don't need to worry about `stateSync` event. If your game has side effects, then you might need to specifically handle this event.

## Detecting game restart {#game-restart}

When a new game session is started (start of the game, restart, new player connecting to an ongoing game), the client `onChange` is called with `stateSync` event which contains `isNewGame` parameter set to true. This is useful when games need to initialize assets, UI or other state in the client for a new game.

# Player Info

You'll often want to show each player’s name and avatar inside your game. Here's how you do it.

## Getting Player Info {#getting-player-info}

Your game receives `allPlayerIds` array in the `onChange` callback, which contains the IDs of all players currently playing. Then use `Rune.getPlayerInfo(playerId)` with a playerId to get info about that player:

- `displayName: string`
- `avatarUrl: string`
- `playerId: string` (same as key, just provided for simplicity)

Note that you can pass the ID of a player that is no longer in game and get placeholder information.

## Avatars {#avatars}

Every player on Rune has their own personalized avatar. We let you use these avatars in your game, which has many benefits:

- Players can easily see which friend is playing what character in your game
- Makes it easy to show players in your UI, leaderboards, etc.
- Consistency between your game and other popular games on Rune

## Your Player ID {#your-player-id}

The `onChange` function provides the client's player ID as `yourPlayerId`. This can be used to find their own info using the `getPlayerInfo()` function described above.

:::tip
Importantly, `yourPlayerId` will be undefined if the client is a spectator!

# Real-Time Games

Rune synchronizes clocks across clients + server to easily add time-based game logic. You can get the synchronized time using `Rune.gameTime()` or `Rune.worldTime()` and make fast-paced games with an `update()` loop running many times pr. second.

## Game Time {#game-time}

You can use `Rune.gameTime()` inside your game, which returns the milliseconds that have passed since the start of the game. By default, Rune provides time precision of a second, which should work well for most casual game purposes.

For instance, this could be used to track how long it took for user to make a guess:

```javascript
// logic.js

function allPlayersDone(game) {
  // ...
}

function setNewQuestionAndAnswer(game) {
  // ...
}

Rune.initLogic({
  setup: (allPlayerIds) => {
    return {
      scores: Object.fromEntries(allPlayerIds.map((id) => [id, 0])),
      roundStartAt: 0,
      question: "A group of otters is called what?",
      correctAnswer: "A raft",
    }
  },
  actions: {
    guess: ({ answer }, { game, playerId }) => {
      if (answer === game.correctAnswer) {
        // Increment score based on time
        const timeTaken = Rune.gameTime() - roundStartAt

        scores[playerId] += max(30 - timeTaken, 0)
      }

      // Start a new round once everyone has answered
      if (allPlayersDone(game)) {
        roundStartAt = Rune.gameTime()
        setNewQuestionAndAnswer(game)
      }
    },
  },
})
```

## World Time {#world-time}

Rune exposes `Rune.worldTime()` to track time passed outside your game, which returns a timestamp in milliseconds since January 1, 1970. Using this value allows building e.g. daily challenges and time-based events. `Rune.worldTime()` has 1 second precision.

Here's how to use `Rune.worldTime()` to determine if the game is played during the winter holidays:

```javascript
// logic.js

Rune.initLogic({
  setup: () => {
    return {
      holidaysEvent:
        Rune.worldTime() > new Date(2024, 12, 20).getTime() &&
        Rune.worldTime() < new Date(2025, 1, 7).getTime(),
    }
  },
})
```

And here's how you can use `Rune.worldTime()` to track the time since the player last played the game:

```javascript
// logic.js

function initPersistPlayer(
  game,
  action,
  event,
  players,
  yourPlayerId,
}) => {
  // Update UI based on game state
}

Rune.initClient({ onChange })
```

## Game State Synchronization

- Client performs action that updates local game state
- Action sent to server for validation
- Valid actions propagate to all clients
- Each client computes new state using action payload

### Restrictions:

- Max 10 actions per player per second
- Actions must execute in <10ms and use <1MB memory
- Game state must be <1MB, action payload <25KB
- Game state must be JSON-serializable
- `logic.js` must be <1MB

## Player Management

- `yourPlayerId` in `onChange` identifies the client (undefined for spectators)
- Use `Rune.getPlayerInfo(playerId)` to get player data (name, avatar)

## Time Synchronization

- `Rune.gameTime()`: milliseconds since game start
- `Rune.worldTime()`: universal timestamp (milliseconds since Jan 1, 1970)

## Real-Time Update Loop

```js
Rune.initLogic({
  update: ({ game }) => {
    // Logic run on interval
  },
  updatesPerSecond: 1 - 30, // Default: 1
})
```

## Reducing Visual Stutter

- Use `Rune.interpolator()` for smooth rendering between updates
- Use `Rune.interpolatorLatency()` for smoother opponent movements

### Basic Interpolation:

```js
const interpolator = Rune.interpolator()

function onChange({ game, futureGame }) {
  interpolator.update({
    game: game.position,
    futureGame: futureGame.position,
  })
}

function render() {
  const position = interpolator.getPosition()
  // Draw at interpolated position
}
```

## Events

- Generated by Rune, not by game code
- Events: `playerJoined`, `playerLeft`, `stateSync`, `update`, `timeSync`
- Handle player joining/leaving with optional callbacks:

```js
Rune.initLogic({
  // ...other configs
  events: {
    playerJoined: (playerId, { game }) => {
      // Initialize player in game
    },
    playerLeft: (playerId, { game }) => {
      // Handle player departure
    },
  },
})
```

## Randomness

- `Math.random()` is made deterministic by Rune
- Keep all shared state in `logic.js`
- Generate random state in `setup()` for all players to see same values

## Player Join/Leave Handling

- `minPlayers`: game can't start with fewer (1-4)
- `maxPlayers`: excess players become spectators
- Game ends if active players drop below `minPlayers`
- Implement `playerJoined`/`playerLeft` to support mid-game joining/leaving

# Game Over

Call `Rune.gameOver(options)` when your game ends to trigger Rune's game over popup with the following options:

### Game Results Options

1. **Cooperative Games**: Use `everyone` property for common results

   ```js
   Rune.gameOver({ everyone: 300 })
   ```

2. **Competitive Games**: Use `players` object with "WON", "LOST", or "TIE" values

   ```js
   Rune.gameOver({
     players: {
       [playerIdA]: "WON",
       [playerIdB]: "LOST",
       [playerIdC]: "TIE",
     },
   })
   ```

3. **Score-Based Games**: Assign numeric scores to players (highest wins)
   ```js
   Rune.gameOver({
     players: {
       [playerIdA]: 21981,
       [playerIdB]: 8911,
     },
   })
   ```

### Additional Options

- `minimizePopUp: true`: Initially show popup in minimized state
- `delayPopUp: true`: Postpone popup display until `Rune.showGameOverPopUp()` is called (auto-shows after a few seconds if not called)
