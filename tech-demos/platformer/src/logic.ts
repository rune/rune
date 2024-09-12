import type { PlayerId, RuneClient } from "rune-sdk/multiplayer"

// how much the players will move per frame
export const MOVE_SPEED = 4
export const MOVE_ACCEL = 1
export const GRAVITY = 1
export const JUMP_POWER = 10

// a simple tile map specifying the sprite
// to show at each location (0 = no sprite)
export const tileMap = [
  [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
]

// The sprite names for each of the players so we have
// some variety in the demo
const PLAYER_TYPES: string[] = [
  "pink-man",
  "ninja-frog",
  "mask-dude",
  "virtual-guy",
]

// the animation any player is showing - controlled
// from the server so everything is synced
export enum Animation {
  IDLE = 0,
  WALK = 1,
  JUMP = 2,
}

// the extra data for the player
export type Player = {
  x: number
  y: number
  sprite: string
  playerId?: PlayerId
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
}

// the controls that we're applying to the game state
// based on which inputs the player is currently pressing
export type Controls = {
  left: boolean
  right: boolean
  jump: boolean
}

// this is the core of what we're trying to keep
// in sync across the network. It'll be held on clients
// and server and the Rune platform will keep it
// in sync by applying deterministic actions
export interface GameState {
  players: Player[]
}

// the actions that players can apply to game state. In
// this case we're only sending the state of the inputs
// the player has - left/right/jump
type GameActions = {
  controls: (controls: Controls) => void
}

// define access to the Rune platform APIs
declare global {
  const Rune: RuneClient<GameState, GameActions>
}

// Check if the player is in a valid location. For the purposes
// of this tech demo this is very simple - just check if the player
// is standing on a valid tile or if they're intersecting
// with another player
function isValidPosition(
  state: GameState,
  player: Player,
  playerX: number,
  playerY: number,
  yoffset: number = 0
): boolean {
  // tile map check across the space thats the player
  for (let x = -12; x <= 12; x += 8) {
    for (let y = -8; y <= 16; y += 8) {
      const tx = Math.floor((x + playerX) / 16)
      const ty = Math.floor((y + playerY + yoffset) / 16)

      if (!tileMap[ty] || tileMap[ty][tx] !== 0) {
        // if we're colliding with the tiles at our feet
        // then reset the player position to align with the
        // tile
        if (player.vy > 0 && y === 16 && yoffset === 0) {
          player.y = Math.ceil(player.y / 16) * 16
        }
        return false
      }
    }
  }

  // search for colliding players
  for (const other of state.players) {
    if (other.playerId !== player.playerId) {
      // simple axis oriented rectangle bounds check. Players
      // are 32x32 sprites but actually take up about 24x24
      // pixels
      if (
        Math.abs(other.x - playerX) < 24 &&
        Math.abs(other.y - playerY) < 24
      ) {
        // if we're standing on a player then reset our position
        // so we align with their head
        if (player.vy > 0 && yoffset === 0) {
          player.y = other.y - 24
        }
        return false
      }
    }
  }

  return true
}

// Initialize the logic side of the Rune platform. This is your main
// hook into the Rune platform for game state synchronization
Rune.initLogic({
  landscape: true,
  // number of players to allow in the game
  minPlayers: 1,
  maxPlayers: 4,
  // this is the initialization function where
  // we setup the initial game state before any player has
  // a chance to modify it. The initial state is sent to
  // all players to start the game
  setup: (allPlayerIds) => {
    const initialState: GameState = {
      // for each of the players Rune says are in the game
      // create a new player entity. We'll initialize their
      // location to place them in the world
      players: allPlayerIds.map((p, index) => {
        return {
          x: 20 + (index + 1) * 32,
          y: 260,
          playerId: p,
          type: "PLAYER",
          sprite: PLAYER_TYPES[index % PLAYER_TYPES.length],
          animation: Animation.IDLE,
          controls: {
            left: false,
            right: false,
            jump: false,
          },
          flipped: false,
          vx: 0,
          vy: 0,
        }
      }),
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
        if (player.vx < 0) {
          player.vx = Math.max(0, player.vx + MOVE_ACCEL)
        } else if (player.vx > 0) {
          player.vx = Math.min(0, player.vx - MOVE_ACCEL)
        }
      }

      player.vy += GRAVITY

      // update players based on their velocities
      if (
        player.vx !== 0 &&
        isValidPosition(game, player, player.x + player.vx, player.y, -1)
      ) {
        player.x += player.vx
        player.animation = Animation.WALK
      }

      if (
        player.vy != 0 &&
        isValidPosition(game, player, player.x, player.y + player.vy)
      ) {
        player.y += player.vy
        player.animation = Animation.JUMP
      } else {
        if (player.vy > 0) {
          player.vy = 0

          // we're on the ground, if we're pressing jump then do it!
          if (player.controls.jump) {
            player.vy = -JUMP_POWER
          }
        } else if (player.vy < 0) {
          player.vy = 0
        }
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
      const player = game.players.find((p) => p.playerId === playerId)

      if (player) {
        player.controls = { ...controls }
      }
    },
  },
})
