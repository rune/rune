import type { RuneClient } from "rune-games-sdk/multiplayer"

type Turning = "left" | "right" | "none"

export interface GameState {
  players: {
    playerId: string
    turning: Turning
    angleInDegrees: number
    line: { x: number; y: number; gap?: boolean }[]
  }[]
}

type GameActions = {
  setTurning(turning: Turning): void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

export const boardSize = {
  width: 400,
  height: 500,
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    return {
      players: allPlayerIds.map((playerId) => ({
        playerId,
        turning: "none",
        angleInDegrees: 45,
        line: [{ x: 10, y: 30 }],
      })),
    }
  },
  actions: {
    setTurning: (turning, { game, playerId }) => {
      const player = game.players.find((p) => p.playerId === playerId)

      if (!player) throw Rune.invalidAction()

      player.turning = turning
    },
  },
  updatesPerSecond: 1,
  update: ({ game }) => {
    game.players.forEach((player) => {
      let goingStraight = false

      if (player.turning === "left") {
        player.angleInDegrees -= 5
      } else if (player.turning === "right") {
        player.angleInDegrees += 5
      } else {
        goingStraight = true
      }

      const speed = 3

      const angleInRadians = (player.angleInDegrees * Math.PI) / 180
      const x =
        player.line[player.line.length - 1].x + Math.cos(angleInRadians) * speed
      const y =
        player.line[player.line.length - 1].y + Math.sin(angleInRadians) * speed

      let reflected = false

      if (x > boardSize.width - 1) {
        player.angleInDegrees = 180 - player.angleInDegrees
        reflected = true
      }
      if (x < 0) {
        player.angleInDegrees = 180 - player.angleInDegrees
        reflected = true
      }
      if (y > boardSize.height - 1) {
        player.angleInDegrees = 360 - player.angleInDegrees
        reflected = true
      }
      if (y < 0) {
        player.angleInDegrees = 360 - player.angleInDegrees
        reflected = true
      }

      const shouldPlaceGap = Math.random() < 1 / 50
      const lastPoint = player.line.at(-1)

      const prev1Gap = player.line.at(-1)?.gap
      const prev2Gap = player.line.at(-2)?.gap
      const prev3Gap = player.line.at(-3)?.gap
      const prev4Gap = player.line.at(-4)?.gap

      const shouldContinueGap = prev1Gap
      const shouldStopGap = prev1Gap && prev2Gap && prev3Gap && prev4Gap
      //
      // player.line.push({
      //   x,
      //   y,
      //   gap: shouldPlaceGap || (shouldContinueGap && !shouldStopGap),
      // })

      if (
        goingStraight &&
        player.line.length > 1 &&
        !reflected &&
        !shouldPlaceGap &&
        lastPoint
      ) {
        lastPoint.x = x
        lastPoint.y = y
      } else {
        player.line.push({ x, y })
      }
    })
  },
  events: {
    playerJoined: (playerId, { game }) => {
      game.players.push({
        playerId,
        turning: "none",
        angleInDegrees: getRandomInt(360),
        line: [
          {
            x: getRandomInt(boardSize.width),
            y: getRandomInt(boardSize.height),
          },
        ],
      })
    },
    playerLeft: (playerId, { game }) => {
      const player = game.players.find((p) => p.playerId === playerId)
      if (!player) return
      game.players.splice(game.players.indexOf(player), 1)
    },
  },
})

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}
