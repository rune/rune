Rune is a platform for creating and playing multiplayer mobile games with integrated voice chat.

Rune games are only played on mobile devices. Controls should always be touched based and should be designed with mobile in mind. Never add keyboard controls to a Rune game. The game should allow for different sizes of mobile screens, but the screen will never resize or change orientation once the game has started. Therefore do not add any listeners or responsive styling to handle screen size changes.

Rune games are locked to portrait mode by default, unless the `landscape: true` option is passed as an option to the `Rune.initLogic()` function, in which case the game will be locked to landscape mode.

After making any changes to a Rune game, you should always check for errors using the check-rune-project-errors MCP server tool. This tool will check for any errors in the project and report them to you. All errors must be fixed before the game can be played.

Rune game projects must conform to some specific rules so that they will function correctly. The following topics are essential to understand when creating or modifying a Rune game.

# Server-Side Logic

Rune uses a server-authoritative approach to ensure games run smoothly and prevent cheating. To do this, your game's `logic.js` file will run on every client and on Rune's servers. Rune ensures that all players see the same thing when playing your game by having some limitations on what kind of code you can write in your `logic.js` file.

The primary aim is to ensure that the code is deterministic, meaning that if you run the code multiple times with the same input it will produce the same result. The main contributors to non-deterministic code in this context is use of other non-deterministic functions such as `Date.now()` and access of shared state such as counters and cache variables.

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

The remaining parts of the code are hopefully self-explanatory. Some code like the `isVictoryOrDraw` function is left out as it’s not important in this context.

```js
Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: () => {
    return {
      cells: Array(9).fill(null),
      // Allow either player to start
      lastPlayerTurn: undefined,
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
      const winner = isVictoryOrDraw(game)
      if (winner !== undefined) {
        Rune.gameOver()
      }
    },
  },
})
```

### Rendering {#rendering}

The game state should be rendered for the player to interact with. That’s the responsibility of `client.js`, which calls `Rune.initClient` with a `onChange` callback function. Whenever an `action` is performed, the `onChange` function is called with read-only info for updating the game experience (animations, graphics, UI, sound effects). The `onChange` has all the info you might need to update your game, including the `action` / `event` that triggered it, the old and new game states, info about the `players`, etc. The `onChange` callback is reliable in that it's always called every time, even on laggy clients with bad internet connection.

The `client.js` also binds the UI to call the `actions`. For instance, for Tic Tac Toe, tapping on a cell would trigger `Rune.actions.markCell({ cellId })`.

```js
const onChange = ({ previousGame, game, action, event, players, yourPlayerId, rollbacks }) => {
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
  playerId
) {
  if (Object.keys(game.persisted[playerId]).length === 0) {
    game.persisted[playerId] = {
      gameLastPlayedAt: Rune.worldTime(),
    }
  }
}

Rune.initLogic({
  persistPlayerData: true,
  setup: (allPlayerIds, {game}) => {

    allPlayerIds.forEach((playerId) => {
        initPersistPlayer(game, playerId)

        const msSinceLastGame = Rune.worldTime() - game.persisted[playerId].gameLastPlayedAt
        const timeInMinutesSinceLastGame = Math.floor(msSinceLastGame / 1000 / 60)
        // Do something with timeInMinutesSinceLastGame (daily rewards, restore energy)
    })

    return {...}
  },
  // Update gameLastPlayedAt for all players every second
  update: ({ game }) => {
    allPlayerIds.forEach((playerId) => {
      game.persisted[playerId].gameLastPlayedAt = Rune.worldTime()
    })
  },
})
```

## Update Function {#update-function}

You can provide an `update` function inside your `logic.js` file to run game logic on an interval. When game state is changed inside your `update` function, the `onChange` inside `client.js` is called with `update` event. Here’s a game, where players have to make a move within 30 seconds or else their turn will pass:

```javascript
// logic.js

Rune.initLogic({
  // ... (code from previous example)
  update: ({ game }) => {
    // Check if 30 seconds has passed, then switch to another question
    if (Rune.gameTime() - game.roundStartAt > 30) {
      roundStartAt = Rune.gameTime()
      setNewQuestionAndAnswer(game)
    }
  },
})
```

By default, the `update` function runs every second. This works well for most party games and makes your game run smoothly and efficiently on almost any device. However, some game will need to run the update function much more frequently than once pr. second. A game like Paddle needs to update the position of the ball and the players' paddles many times per second. The game can specify this by providing `updatesPerSecond` to `Rune.initLogic()`. The `updatesPerSecond` option can be set to any integer value between 1 and 30. The game will not run if `updatesPerSecond` is set to a value outside of this range. In the following example, the `update` function will be called 30 times per second on all clients:

```javascript
Rune.initLogic({
  update: ({ game }) => {
    game.ballPosition += game.ballSpeed
    // ... (remaining game logic)
  },
  updatesPerSecond: 30,
})
```

The `update` function is run in a synchronized way across all clients and the server. Only actions are sent to the server, which makes Rune real-time games very bandwidth efficient so that they can work even on mobile devices with limited bandwidth. Even with our optimizations, your game might still experience stuttering due to latency between players or varying frame rates across devices. Rune helps you reduce this stuttering through interpolators.

## The `timeSync` Event {#the-timesync-event}

Network packets between the client and server are sometimes delayed due to bad internet connection. If that happens, the server might execute the action at different game time compared to the optimistic client action. If this has impact on game state, the client that made the optimistic action will receive a `onChange` call with `timeSync` event.

Let's consider a game with the following game logic:

```javascript
// logic.js

Rune.initLogic({
  setup() {
    return {
      clickedAt: 0,
    }
  },
  actions: {
    click(_, { game }) {
      game.clickedAt = Rune.gameTime()
    },
  },
})
```

The game is played by two players (Player A and Player B), who do the following:

- PlayerA calls the action `click` when game time is at second 4. Player A receives `onChange` call with `click` action as an argument, making Player A see `game.clickedAt = 4`.
- Server receives and processes the action at game time second 5.
- Every client receives that the action was executed at 5th second.

Player A's `onChange` function will now be called with `timeSync` event to reconcile that the server processed the action at second 5 (and the server holds the truth). In this way, both players end up with `game.clickedAt = 5`.

# Reducing Stutter

This page focuses on reducing stutter for fast-paced multiplayer games running an update loop many times pr. second. However, you can also make really fun real-time multiplayer games without needing the more complex code described below. If you're new to Rune or game development, we suggest you start by making a game without an update loop or an update loop only running once pr. second.

:::tip

Most games don't need the interpolators described here to have a smooth playing experience. It's only needed for some fast-paced games. We always recommend first building your game and only then adding interpolation later if you need it.

:::

## Rendering At Variable Frame Rate {#rendering-at-variable-frame-rate}

We will use the example of Paddle to explain how Rune makes it simple to make fast-paced multiplayer games. A game like Paddle is updating the position of the ball and the players' paddles many times per second. We can code this in the `logic.js` file by specifying an `update` function and the `updatesPerSecond` value. In the following example, the `update` function will be called 30 times per second on all clients.

```javascript
Rune.initLogic({
  update: ({ game }) => {
    game.ballPosition += game.ballSpeed
    // ... (remaining game logic)
  },
  updatesPerSecond: 30,
})
```

The update loop will always run at a fixed tick rate, but mobile phones will render your game's graphics slower or faster than that. This is highly dependent on how powerful the device is and how intensive your game is to run. To support rendering at a variable frame rate, your game can interpolate positions between the `update` function calls. This is only needed for fast-moving objects stored in the `game` state such as the ball and paddles in Paddle.

Consider a Paddle game with `updatesPerSecond: 10`, i.e. the game state updates every 100 ms. The ball is at position 0 in `game` at 0 ms and will be at position 10 in after 100 ms. When the phone wants to render the game at 60 ms, it should render at position 6 as the ball should be 60% towards the new position.

Rune provides `futureGame`, which contains the game state after another run of the `update` function, thereby providing a glimpse into the future. The game can interpolate between the current game state and the future game state by using `Rune.interpolator()`. The interpolator allows the game to compute the ball's position at any time and will make the game look more fluid for fast-moving objects. Here's how this would be used for rendering the ball in Paddle at a variable frame rate:

```javascript
const ballInterpolator = Rune.interpolator()

function onChange({ game, futureGame }) {
  ballInterpolator.update({
    game: game.ballPosition,
    futureGame: futureGame.ballPosition,
  })
}

// Rendering function called by the game's graphics engine
function render() {
  const ballPosition = ballInterpolator.getPosition()

  // ... (draw the ball using the game's graphics engine)
}

// Initialize the game with the callback function
Rune.initClient({ onChange })
```

There might be game-specific scenarios, where the game should not interpolate into the future. For instance, when a point is scored in Paddle, the ball position will reset in `logic.js` and the game should not interpolate the position between `game` and `futureGame`. The game can do this by not calling `update()` on the interpolator in that scenario, i.e. updating the code above with an if condition checking the current score vs. the future score:

```javascript
// Replaces function in previous code block
function onChange({ game, futureGame }) {
  if (game.totalScore === futureGame.totalScore) {
    ballInterpolator.update({
      game: game.ballPosition,
      futureGame: futureGame.ballPosition,
    })
  }
}
```

## Interpolating Other Players' Movements {#interpolating-other-players-movements}

Making fast-paced multiplayer games can be challenging because of the latency between players. No matter how good the device and internet connection is, the network packets cannot travel faster than the speed of light. This means that your game will receive other's players actions some time after they happened. If other players can quickly move around in your game, then you will need to do interpolation of their positions to make their movements look smooth. This is done in the client-side code, i.e. in `client.js`.

:::tip

First implement your game without interpolation for simplicity. Then you can test in the Dev UI whether it's actually needed.

:::

In Paddle, the players control the paddles, and the game must therefore interpolate the other players' paddles to get smooth movements. The core game state and update loop in paddle could be defined as this:

```javascript
Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  updatesPerSecond: 30,
  setup: (allPlayerIds) => {
    // Paddles only move in 1 dimension so can just specify one position and speed
    const paddles = [
      { position: START_POSITION, speed: 0 },
      { position: START_POSITION, speed: 0 },
    ]
    const players = [
      { id: allPlayerIds[0], score: 0 },
      { id: allPlayerIds[1], score: 0 },
    ]
    return { paddles, players, totalScore: 0 }
  },
  update: ({ game }) => {
    for (let i = 0; i < 2; i++) {
      game.paddles[i].position += game.paddles[i].speed

      // Clamp to sides
      if (game.paddles[i].position < 0) {
        game.paddles[i].position = 0
        game.paddles[i].speed = 0
      }
      if (game.paddles[i].position + PADDLE_WIDTH > GAME_WIDTH) {
        game.paddles[i].position = 0
        game.paddles[i].speed = 0
      }
    }
    // ... (remaining game logic)
  },
  actions: {
    // ... (player inputs to move paddles by changing paddle speed)
  },
})
```

The `game` state is provided to the `onChange` callback as `game`. Because of network latency, the position in `game` may suddenly change dramatically for the other player's paddle. Without interpolation, the paddle would teleport around on the screen. To instead make the paddle movements look smooth despite the latency, the game can create an interpolator using `Rune.interpolatorLatency`.

The game should call the interpolator's `update()` function, which moves the interpolated position towards the true position specified in `game`. The game can at any time get the interpolated position from the interpolator by calling `getPosition()`. This function returns the position adjusted for the time of rendering (see section above) so it can be used directly to achieve both interpolation and supporting variable frame rate.

Here's that code for the paddle game:

```javascript
import { playerSpeed } from "./logic.js"

let opponentInterpolator = Rune.interpolatorLatency({ maxSpeed: playerSpeed })

function onChange({ game, futureGame, yourPlayerId }) {
  const opponent = game.players.findIndex((p) => p.id !== yourPlayerId)

  opponentInterpolator.update({
    game: game.paddles[opponent].position,
    futureGame: futureGame.paddles[opponent].position,
  })
}

// Rendering function called by the game's graphics engine
function render() {
  const opponentPosition = opponentInterpolator.getPosition()

  // ... (draw the opponent's paddle using the game's graphics engine)
}

// Initialize the game with the callback function
Rune.initClient({ onChange })
```

There might be game-specific scenarios, where the game will want to immediately move the other players' positions without interpolating. For instance, when a point is scored in Paddle, the player positions reset in `logic.js` and the opponent position should be updated immediately. The game can detect that a point was just scored by comparing `game` with `previousGame`, which contains the game state for the last `onChange` call. The game can then call `moveTo()` on the interpolator, which will also reset the speed inside the interpolator to zero so that it doesn't move anywhere. Here's the code for that:

```javascript
function onChange({ previousGame, game }) {
  const opponent = game.players.findIndex((p) => p.id !== yourPlayerId)

  if (previousGame.totalScore < game.totalScore) {
    opponentInterpolator.moveTo(game.paddles[opponent].position)
  }
}
```

# Randomness

Most games involve some kind of randomness, for example to roll a die in the case of Yahtzee. However, randomness introduces some problems:

- True randomness is inherently **not deterministic**, which is not compatible with Rune's distributed game state model.
- True randomness with optimistic updates places trust in the client, and therefore **opens up to cheating** for a technically sophisticated player.

## Deterministic random

Rune solves this problem by implementing a deterministic pseudorandom number generator. In simpler words this means the Rune server tells each player client to calculate random numbers. For every action the player takes, the server verifies that the random numbers being generated are in fact generated in the way the server told it to.

What's great about it is that the game can do optimistic updates which leads to a really fast game, and that cheating is hard as the player client only knows how to generate their own numbers and cannot know what the other players will get.

## Things to keep in mind

Rune solves this transparently and in the majority of cases **you can keep using `Math.random()`** as you would in any other game. There are some specific things to keep in mind however:

### Keep all shared state in `logic.js`

This isn't limited to randomness, but is especially important here, as only the code called from within `Rune.initLogic()`/`logic.js` has the deterministic random. If you have some kind of initialization code that generates data for your game, make sure to do this in `setup()` so that all players see the same thing.

### Shared random

If your games needs deterministic shared randomness, meaning that the randomness is determined by the order an action is taken, regardless of who makes an action. This can be solved in different ways depending on the needs:

- Set a shared random state in `setup()` using `Math.random()` to be used in your own number generator.
- Generate all state that depends on randomness in `setup()` such as the board in a collaborative minesweeper game.

# Joining and Leaving

One complexity of multiplayer games is that there may be different number of players, people joining/leaving, etc. Rune handles this complexity by default by automatically making additional people in the room spectators and so on. If you want and your game supports it, you can opt-in to handling more of this complexity.

# Events

Rune has `events`, which are always triggered based on room changes (e.g. a player joining). This is opposed to `actions` , which are always called by game. Currently available events are: `playerJoined`, `playerLeft`, `stateSync`, `update`, `timeSync`.

Whenever an event happens, `onChange` is called with `event` as a parameter to let the game visually change its appearance based on the changes. The game can provide an optional callback for `playerJoined` and `playerLeft` in `logic.js`, which allows the game to change game state when they happen.

Below is an overview comparing actions & events.

|                       | Actions    | Events                     |
| --------------------- | ---------- | -------------------------- |
| Defined and called by | Game Dev   | Rune                       |
| Quantity              | Any number | Predefined (currently 5)   |
| Update game state?    | Yes        | If using optional callback |
| Might be rolled back? | Yes        | No                         |

## Spectating {#spectating}

Many games only support a few players. The remaining users in the room will be spectators. Spectators are:

- Running game code as everyone else, i.e. calls `onChange` on new actions/events
- Unable to make any actions (enforced by the SDK)
- Not triggering `playerJoined` or `playerLeft` events
- Not provided in `players` argument to `onChange`
- Shown differently in the room UI
- Has `yourPlayerId: undefined` argument for `onChange`

This means that the number of players that the game SDK sees may not equal the number of users in the room. This is intended.

## Minimum and Maximum Players {#minimum-and-maximum-players}

As an argument to `initLogic()` , the game provides `minPlayers`, which is an int from 1 to 4. For instance, chess would specify `minPlayers: 2`. The game cannot be started with fewer players.

If a player leaves and the game drops below `minPlayers`, the game will end. If the game provides a `playerLeft` callback, it may specify a winner among the remaining players using `Rune.gameOver()`. Note that the `playerLeft` callback must be provided to support players leaving midgame anyway.

Similar to `minPlayers`, the game provides `maxPlayers`. When anyone joins the room beyond two players, they automatically become a spectator.

## Supporting Players Joining Midgame {#supporting-players-joining-midgame}

Imagine a card-game like Hearts, where all the cards are dealt at the beginning of the game. It wouldn’t make sense for a player to join the gameplay after the cards have been dealt as they wouldn’t be able to receive any cards. Instead they should join as a spectator, waiting for the game to finish. This is the default behavior for any game. Restarting the game or changing the game will make the late joiners become players (assuming they’re below `maxPlayers` threshold).

The game can provide a `playerJoined` callback in `initLogic()` to make it clear that they support players dynamically joining. This can be useful for e.g. collaborative crosswords or an open world exploration game like Minecraft, where the players are quite independent.

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

## Supporting Players Leaving Midgame {#supporting-players-leaving-midgame}

Continuing the example of the card-game Hearts, it’s quite complex to decide what should happen if a player leaves. By default, Rune will end the game. Players can then restart or choose an new one from the game selection.

The game can provide a `playerLeft` callback in `initLogic()` to make it clear that they support players dynamically leaving. The callback will “clean up” the game state and let the game continue for the remaining players. For games with turns, the game should skip the turn if it’s the turn of the player who left.

A player will only be determined as having left the game once they leave the room. This means that if one of the players’ connection broke, they have 30 seconds to reconnect. Having a timeout like this lets the game go on if someone is losing internet connection for good.

## Moving to Spectator and Back {#moving-to-spectator-and-back}

Users who are currently playing may want to just listen in and not participate in the gameplay. For instance, they may want to grab food / do homework while others play. They should be able to make themselves a spectator. This will trigger a `playerLeft` event and the game will remove that player from the game.

If they at a later time want to rejoin the same ongoing game, they can do that through the UI as well (assuming the game supports dynamic joins and the game is not at `maxPlayers`). Rejoining the game triggers `playerJoined` and they would start afresh in the same state as any other new players joining the game.
