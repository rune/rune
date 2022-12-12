---
sidebar_position: 2
---

# Syncing Game State

Underlying all multiplayer gaming is syncing game information. This page will use the simple example of Tic Tac Toe to explain how the game state is synced across players.

## Separation into Logic and Rendering

Multiplayer games are generally separated into game logic and rendering. This separation has many benefits, including being able to run dedicated servers that only have game logic. Rune multiplayer games are also separated into logic and rendering.

### Logic

The logic is stored in a single file, `logic.js`, and initialized by running `Rune.initLogic()` with `minPlayers`, `maxPlayers`, `setup` and `actions`. The `minPlayers` and `maxPlayers` values ensure the game only have to consider a number of players between those two values. All other cases are Rune, incl. automatically making remaining people in the room spectators (more info in [Joining and Leaving](joining-leaving.md)).

The `setup` function returns the initial values for the `game` state, which is the game information that’s synced across players. In the case of Tic Tac Toe, the `game` state describes who’s turn it is and which of the 9 cells have been filled with an X or an O. The `setup` function gets the `players` argument with info about the players at the time of starting the game.

The player can perform one of the `actions` to modify the game state. An `action` is a function that take as input an object with arguments. The function is also provided the `game` state and `playerId` containing the ID of the player, who performed the action. In the case of Tic Tac Toe, the only needed `action` is to mark a cell with an X or O.

Only `logic.js` file can modify the `game` state. The `setup` and `actions` functions cannot make use of any data from outside of their function definition and can’t modify anything outside the function definition (i.e. they’re pure functions w/o side effects).

The remaining parts of the code are hopefully self-explanatory. Some code like the `isVictoryOrDraw` function is left out as it’s not important in this context.

```jsx
Rune.initLogic({
	minPlayers: 2,
	maxPlayers: 2,
	setup: (players) => {
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

### Rendering

The game state should be rendered for the player to interact with. That’s the responsibility of `client.js`, which calls `Rune.initClient` with a `visualUpdate` callback function. Whenever an `action` is performed, the `visualUpdate` function is called with read-only info for updating the game experience (animations, graphics, UI, sound effects). The `visualUpdate` has all the info you might need to update your game, including the `action` / `event` that triggered it, the old and new game states, info about the `players`, etc.

The `client.js` also binds the UI to call the `actions`. For instance, for Tic Tac Toe, tapping on a cell would trigger `Rune.actions.markCell({ cellId })`.

```jsx
const visualUpdate = ({
	oldGame,
	newGame,
	action,
	event,
	players,
	yourPlayerId,
	rollbacks,
}) => {
	// TODO: Update animations, graphics, UI, sound effects
}

Rune.initClient({ visualUpdate })
```

## High-Level Game Syncing Flow

Rune does a lot of magic behind the scenes to sync the game state. Here’s a simplified overview of how it works:

1. A client performs an `action` by interacting with the game (e.g. clicking a cell in Tic Tac Toe). The client optimistically updates `game` state by calling the associated `action` function (i.e. `clickCell` in the case of Tic Tac Toe) and calls `visualUpdate` to update the graphics etc.
2. The `action` is immediately sent to the server. The server runs the associated `actions` function provided by the game, thereby checking that the `action` is valid and whether the game ends.
3. If the `action` is valid, the server updates its groundtruth `game` state and sends the `action` out to all connected clients. If the `action` is not valid, it’s ignored.
4. Each client computes the new `game` state using the `action` payload and the associated function in `actions`. It’s much cheaper bandwidth-wise to send the `action` than the entire `game` state. The client who sent the `action` will also receive the same `action` payload from the server as an acknowledgement message.

## Restrictions

- Game logic must be written in a subset of JavaScript, see [Logic Restrictions](logic-restrictions.md). The client showing the visual interface can be written in any game engine as long as it uses the JS logic underneath.
- Max 3 actions per player per second.
- Actions must be synchronous, fast and be memory efficient – execute in <10ms and consume <5MB memory.
- The `visualUpdate` function must be synchronous. It may trigger async functions if needed, but cannot `await` them.
- The `game` state must be <1 MB and any `action` payload below <100 KB to avoid unnecessary network bandwidth usage.
- The `game` state must be JSON-serializable (e.g. no classes/functions) so it can be sent over the network.
