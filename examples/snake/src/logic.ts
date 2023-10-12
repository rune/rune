import type { RuneClient } from "rune-games-sdk/multiplayer"

type Turning = "left" | "right" | "none"

export type Point = {
  x: number
  y: number
}

type Section = {
  start: Point
  end: Point
  turning: Turning
  startAngle: number
  endAngle: number
  gap?: boolean
}

export interface GameState {
  players: {
    playerId: string
    turning: Turning
    // TODO: also count down from last gap to avoid gaps being too close
    placingGap: number
    // angleInDegrees: number
    line: Section[]
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

export const forwardSpeedPixelsPerTick = 3
export const turningSpeedDegreesPerTick = 3

const gapFrequency = 0.02

const gapLength = 15

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const startPoint = {
      x: 200,
      y: 300,
    }
    const angle = 270

    return {
      players: allPlayerIds.map((playerId) => ({
        playerId,
        turning: "none",
        placingGap: 0,
        line: [
          {
            start: startPoint,
            end: startPoint,
            turning: "none",
            startAngle: angle,
            endAngle: angle,
          },
        ],
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
  updatesPerSecond: 30,
  update: ({ game }) => {
    game.players.forEach((player) => {
      let lastSection = player.line[player.line.length - 1]
      const turnMod =
        player.turning === "none" ? 0 : player.turning === "right" ? 1 : -1

      const wasPlacingGap = !!player.placingGap

      if (player.placingGap) {
        player.placingGap--
      } else {
        if (Math.random() < gapFrequency) player.placingGap = gapLength
      }

      if (
        lastSection.turning !== player.turning ||
        wasPlacingGap !== !!player.placingGap
      ) {
        player.line.push({
          start: { ...lastSection.end },
          end: { ...lastSection.end },
          turning: player.turning,
          startAngle: lastSection.endAngle,
          endAngle: lastSection.endAngle,
          gap: !!player.placingGap,
        })
        lastSection = player.line[player.line.length - 1]
      }

      lastSection.endAngle += turningSpeedDegreesPerTick * turnMod

      lastSection.end.x =
        lastSection.end.x +
        Math.cos(degreesToRad(lastSection.endAngle)) * forwardSpeedPixelsPerTick
      lastSection.end.y =
        lastSection.end.y +
        Math.sin(degreesToRad(lastSection.endAngle)) * forwardSpeedPixelsPerTick
    })
  },
  events: {
    playerJoined: (playerId, { game }) => {
      const startPoint = {
        x: getRandomInt(boardSize.width),
        y: getRandomInt(boardSize.height),
      }
      const angle = getRandomInt(360)

      game.players.push({
        playerId,
        turning: "none",
        placingGap: 0,
        line: [
          {
            start: startPoint,
            end: startPoint,
            startAngle: angle,
            endAngle: angle,
            turning: "none",
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

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function degreesToRad(degrees: number) {
  return degrees * (Math.PI / 180)
}
