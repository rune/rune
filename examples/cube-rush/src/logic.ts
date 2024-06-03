import type { PlayerId, RuneClient } from "rune-games-sdk/multiplayer"
import {
  COUNTDOWN_MS,
  CUBE_DEPTH,
  CUBE_WIDTH,
  HALF_SHIP_WIDTH,
  LEFT_WALL_POSITION,
  RIGHT_WALL_POSITION,
  SHIP_DEPTH,
  SHIP_START_POSITIONS,
  TRACK_DISTANCE,
  UPDATES_PER_SECOND,
  SHIP_INIT_SPEED,
  SHIP_MIN_SPEED,
  SHIP_MAX_SPEED,
  SHIP_X_SPEED_RATE,
  SHIP_Z_SPEED_RATE,
} from "./config"
import { MAPS } from "./maps.ts"

export type ShipDirection = "left" | "right" | null

type Ship = {
  position: {
    x: number
    z: number
  }
  rotation: {
    z: number
  }
  direction: ShipDirection
  xSpeed: number
  zSpeed: number
  topZSpeed: number
  lastPassedCubeIdx: number
  isColliding: boolean
}

type Phase = "PAUSED" | "COUNTDOWN" | "PLAYING"

export interface GameState {
  startedAt: number | null
  phase: Phase
  ships: Record<PlayerId, Ship>
  mapIndex: number
  completedPlayers: Record<
    PlayerId,
    { place: number; elapse: number; showBestTime: boolean }
  >
}

type GameActions = {
  switchPhase: (phase: Phase) => void
  setShipDirection: (direction: ShipDirection) => void
}

export type Persisted = {
  bestTime: number
}

declare global {
  const Rune: RuneClient<GameState, GameActions, Persisted>
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 6,
  // NB: Use literal number below because of bug with parsing. Sync with UPDATES_PER_SECOND
  updatesPerSecond: 30,
  persistPlayerData: true,
  landscape: true,
  setup: (allPlayerIds): GameState => {
    // Setup ships
    const ships: Record<PlayerId, Ship> = {}

    const shipStartPositions =
      SHIP_START_POSITIONS[
        Math.min(allPlayerIds.length - 1, SHIP_START_POSITIONS.length - 1)
      ]
    for (const [idx, playerId] of allPlayerIds.entries()) {
      ships[playerId] = {
        position: {
          x: shipStartPositions[idx % shipStartPositions.length],
          z: 0,
        },
        rotation: {
          z: 0,
        },
        xSpeed: 0,
        zSpeed: SHIP_INIT_SPEED,
        topZSpeed: 0,
        direction: null,
        lastPassedCubeIdx: -1,
        isColliding: false,
      }
    }

    return {
      startedAt: null,
      phase: "PAUSED",
      ships,
      mapIndex: Math.floor(Math.random() * MAPS.length),
      completedPlayers: {},
    }
  },
  actions: {
    switchPhase: (phase, { game }) => {
      if (game.phase === phase) return

      game.phase = phase
      if (game.phase === "COUNTDOWN") {
        game.startedAt = Rune.gameTime()
      }
    },
    setShipDirection: (direction, { game, playerId }) => {
      game.ships[playerId].direction = direction
    },
  },

  update: ({ game, allPlayerIds }) => {
    if (game.phase === "PAUSED") {
      return
    }

    if (game.phase === "COUNTDOWN" && game.startedAt) {
      if (Rune.gameTime() - game.startedAt > COUNTDOWN_MS) {
        game.phase = "PLAYING"
      }

      return
    }

    for (const playerId of allPlayerIds) {
      // Ignore completed player
      if (game.completedPlayers[playerId]) continue

      const ship = game.ships[playerId]

      // Horizontal speed used for changing ship direction
      if (ship.direction === null) {
        ship.xSpeed *= 0.8
      } else if (ship.direction === "left") {
        ship.xSpeed += 0.02 * SHIP_X_SPEED_RATE
      } else if (ship.direction === "right") {
        ship.xSpeed -= 0.02 * SHIP_X_SPEED_RATE
      }

      ship.xSpeed = Math.max(-0.5, Math.min(0.5, ship.xSpeed))
      ship.position.x += ship.xSpeed * SHIP_X_SPEED_RATE * -10
      ship.position.x = Math.min(
        Math.max(ship.position.x, LEFT_WALL_POSITION + HALF_SHIP_WIDTH),
        RIGHT_WALL_POSITION - HALF_SHIP_WIDTH,
      )

      ship.isColliding = false

      // Forward speed
      if (ship.zSpeed < 300) {
        // Quickly increase speed
        ship.zSpeed *= 1.01
        // Cap max speed
        ship.zSpeed = Math.min(ship.zSpeed, 300)
      } else {
        // Slowly increase speed
        ship.zSpeed += 10 / UPDATES_PER_SECOND
        // Cap max speed
        ship.zSpeed = Math.min(ship.zSpeed, SHIP_MAX_SPEED)
      }
      ship.topZSpeed = Math.max(ship.topZSpeed, ship.zSpeed)
      ship.position.z -= ship.zSpeed * SHIP_Z_SPEED_RATE

      ship.rotation.z = (ship.rotation.z + ship.xSpeed * 10) * 0.7
      ship.rotation.z = Math.min(0.4, Math.max(-0.4, ship.rotation.z))

      // Collision detection
      const shipStartZ = ship.position.z + SHIP_DEPTH / 2
      const shipEndZ = ship.position.z - SHIP_DEPTH / 2

      for (
        let idx = ship.lastPassedCubeIdx + 1;
        idx < MAPS[game.mapIndex].length;
        idx++
      ) {
        const [x, z] = MAPS[game.mapIndex][idx]

        // Ship is before the cube on z dimension
        const cubeStartZ = z + CUBE_DEPTH / 2
        if (shipEndZ > cubeStartZ) break // No cubes yet

        const cubeEndZ = z - CUBE_DEPTH / 2
        if (shipStartZ < cubeEndZ) {
          // Ship is after the cube on z dimension
          ship.lastPassedCubeIdx = idx

          // Do not break out of the loop in order to apply potential collision with other cubes
        } else {
          // Ship is in collision on z dimension
          if (
            Math.abs(ship.position.x - x) <
            CUBE_WIDTH / 2 + HALF_SHIP_WIDTH
          ) {
            ship.isColliding = true
            // Ship is in collision on all dimensions
            ship.zSpeed *= 0.5
            // Cap min speed
            ship.zSpeed = Math.max(ship.zSpeed, SHIP_MIN_SPEED)
            break
          }
        }
      }

      // Add to completedPlayers when player finishes
      if (-ship.position.z >= TRACK_DISTANCE) {
        ship.position.z = -TRACK_DISTANCE
        ship.zSpeed = 0

        const place = Object.keys(game.completedPlayers).length + 1
        const elapse = Rune.gameTime() - game.startedAt!

        //Only show best time if user has persisted state from before
        game.completedPlayers[playerId] = {
          place,
          elapse,
          showBestTime: !!game.persisted[playerId].bestTime,
        }

        game.persisted[playerId] = {
          bestTime: !game.persisted[playerId].bestTime
            ? elapse
            : Math.min(game.persisted[playerId].bestTime, elapse),
        }
      }

      // Game over when all players finish
      if (Object.keys(game.completedPlayers).length === allPlayerIds.length) {
        Rune.gameOver({
          players: Object.fromEntries(
            Object.entries(game.completedPlayers).map(
              ([playerId, { place }]) => [
                playerId,
                place === 1 ? "WON" : "LOST",
              ],
            ),
          ),
        })
      }
    }
  },

  events: {
    playerLeft(playerId, { game }) {
      delete game.completedPlayers[playerId]
    },
  },
})
