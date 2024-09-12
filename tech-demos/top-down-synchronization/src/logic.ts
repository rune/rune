import type { PlayerId, RuneClient } from "rune-sdk/multiplayer"

// how much the players will move per frame
export const MOVE_SPEED = 4
export const MOVE_ACCEL = 1

// a simple tile map specifying the sprite
// to show at each location (-1 = no sprite)
export const tileMap = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [20, 21, 21, 21, 21, 11, 11, 21, 21, 21, 21, 22],
  [-1, -1, -1, -1, -1, 10, 12, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, 20, 22, -1, -1, -1, -1, -1],
]

// the position of the trees for the demo
export const trees = [
  [200, 50],
  [300, 120],
  [50, 200],
  [80, 400],
  [500, 100],
  [480, 300],
  [550, 200],
  [300, 400],
  [700, 450],
]

// types of entities we'll display in the world
export type EntityType = "PLAYER" | "TREE"

// the animation any player is showing - controlled
// from the server so everything is synced
export enum Animation {
  IDLE = 0,

  WALK = 6,
}

// an entity is anything that is displayed in the world
// outside of the base tile map. These will be
// z-sorted to give top down style depth
export type Entity = {
  x: number
  y: number
  sprite: number
  type: EntityType
  playerId?: PlayerId
}

// the extra data for the player
export type Player = {
  // the state of the controls for this player - this
  // is the bit thats actually sent regularly across
  // the network
  controls: Controls
  animation: Animation
  vx: number
  vy: number
  // true if the player is facing left instead of right
  // as the sprites are designed
  flipped: boolean
} & Entity

// the controls that we're applying to the game state
// based on which inputs the player is currently pressing
export type Controls = {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
}

// this is the core of what we're trying to keep
// in sync across the network. It'll be held on clients
// and server and the Rune platform will keep it
// in sync by applying deterministic actions
export interface GameState {
  entities: Entity[]
  players: Player[]
}

// the actions that players can apply to game state. In
// this case we're only sending the state of the inputs
// the player has - up/down/left/right/movement
type GameActions = {
  controls: (controls: Controls) => void
}

// define access to the Rune platform APIs
declare global {
  const Rune: RuneClient<GameState, GameActions>
}

// Check if the player is in a valid location. For the purposes
// of this tech demo this is very simple - just check if the player
// is standing on a valid tile
function isValidPosition(state: GameState, x: number, y: number): boolean {
  x = Math.floor(x / 64)
  y = Math.floor(y / 64)

  return tileMap[y] && tileMap[y][x] >= 0
}

// Initialize the logic side of the Rune platform. This is your main
// hook into the Rune platform for game state synchronization
Rune.initLogic({
  // number of players to allow in the game
  minPlayers: 1,
  maxPlayers: 4,
  // this is the initialization function where
  // we setup the initial game state before any player has
  // a chance to modify it. The initial state is sent to
  // all players to start the game
  setup: (allPlayerIds) => {
    const initialState: GameState = {
      entities: [],
      // for each of the players Rune says are in the game
      // create a new player entity. We'll initialize their
      // location to place them in the world
      players: allPlayerIds.map((p, index) => {
        return {
          x: (index + 1) * 64,
          y: (index + 1) * 64,
          playerId: p,
          type: "PLAYER",
          // make the player have a different sprite color
          // based on their index in the player array. This is
          // a very simple approach for the purposes of a
          // tech demo
          sprite: index % 4,
          animation: Animation.IDLE,
          controls: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          flipped: false,
          vx: 0,
          vy: 0,
        }
      }),
    }

    // add the tree entities
    for (const tree of trees) {
      initialState.entities.push({
        type: "TREE",
        x: tree[0],
        y: tree[1],
        sprite: 4,
      })
    }

    return initialState
  },
  // the number of updates per second the game logic is going to run out. In most
  // cases this doesn't need to be as high as 30 but for the purposes of the
  // tech mode we'll just use the maximum
  updatesPerSecond: 30,
  // the update loop where we progress the game based on the current player inputs
  // that have been sent through actions.
  update: ({ game }) => {
    // go through all the players and update them
    for (const player of game.players) {
      // assume the player is doing nothing to start with
      player.animation = Animation.IDLE

      // for each control that the player has pressed attempt to move them
      // in the appropriate direction. Only move if the player isn't blocked
      // by whatever is in the tile map.
      //
      // The client will run a copy of this logic and update() loop so will
      // immediately update is run. The server will also run a copy of this
      // logic and update() loop but slightly behind the client to allow
      // for any action conflict resolution, e.g. two players try to take
      // the same item. When the server has resolved the conflict the client
      // will rollback its changes if needed and apply the new actions from
      // the authoritative server putting the client back in the correct state.
      if (player.controls.left) {
        player.vx = Math.max(-MOVE_SPEED, player.vx - MOVE_ACCEL)
        player.flipped = true
      } else if (player.controls.right) {
        player.vx = Math.min(MOVE_SPEED, player.vx + MOVE_ACCEL)
        player.flipped = false
      } else {
        if (player.vx > 0) {
          player.vx = Math.max(0, player.vx - MOVE_ACCEL)
        } else if (player.vx < 0) {
          player.vx = Math.min(0, player.vx + MOVE_ACCEL)
        }
      }

      if (player.controls.up) {
        player.vy = Math.max(-MOVE_SPEED, player.vy - MOVE_ACCEL)
      } else if (player.controls.down) {
        player.vy = Math.min(MOVE_SPEED, player.vy + MOVE_ACCEL)
      } else {
        if (player.vy > 0) {
          player.vy = Math.max(0, player.vy - MOVE_ACCEL)
        } else if (player.vy < 0) {
          player.vy = Math.min(0, player.vy + MOVE_ACCEL)
        }
      }

      // update players based on their velocities
      if (
        player.vx !== 0 &&
        isValidPosition(game, player.x + player.vx, player.y)
      ) {
        player.x += player.vx
        player.animation = Animation.WALK
      }
      if (
        player.vy != 0 &&
        isValidPosition(game, player.x, player.y + player.vy)
      ) {
        player.y += player.vy
        player.animation = Animation.WALK
      }
    }
  },
  // actions are the way clients can modify game state. Rune manages
  // how and when these actions are applied to maintain a consistent
  // game state between all clients.
  actions: {
    // Action applied from the client to setup the controls the
    // player is currently pressing. We simple record the controls
    // and let the update() loop actually apply the changes
    controls: (controls, { game, playerId }) => {
      const entity = game.players.find((p) => p.playerId === playerId)

      if (entity && entity.type === "PLAYER") {
        ;(entity as Player).controls = { ...controls }
      }
    },
  },
})
