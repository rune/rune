import type { RuneClient } from "rune-games-sdk/multiplayer"
import { PlayerId } from "rune-games-sdk"

type Turning = "left" | "right" | "none"

export type Point = {
  x: number
  y: number
}

type Section = {
  start: Point
  end: Point
  endAngle: number
  gap: boolean
} & (
  | { turning: "none" }
  | {
      turning: "left" | "right"
      arc: {
        center: Point
        radius: number
        startAngle: number
        endAngle: number
      }
    }
)

type PlayerInfo = {
  playerId: string
  turning: Turning
  // TODO: also count down from last gap to avoid gaps being too close
  placingGap: number
  color: string
  line: Section[]
}

export interface GameState {
  players: PlayerInfo[]
}

type GameActions = {
  setTurning(turning: Turning): void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

export const boardSize = {
  width: 600,
  height: 900,
}

export const forwardSpeedPixelsPerTick = 3
export const turningSpeedDegreesPerTick = 3

const arcRadius =
  (180 * forwardSpeedPixelsPerTick) / (Math.PI * turningSpeedDegreesPerTick)

const gapFrequency = 0.01

const gapLength = 15

const colors = ["#BCFE00", "#10D4FF", "#FF32D2", "#FF9C27"]

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    return {
      players: allPlayerIds.map((playerId, index) =>
        getNewPlayer(playerId, colors[index])
      ),
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
    // TODO: remove this
    if (Rune.gameTime() > 10000) return

    game.players.forEach((player) => {
      let lastSection = player.line[player.line.length - 1]

      const turningModifier =
        player.turning === "none" ? 0 : player.turning === "right" ? 1 : -1

      const wasPlacingGap = !!player.placingGap

      if (player.placingGap) {
        player.placingGap--
      } else {
        if (Math.random() < gapFrequency) player.placingGap = gapLength
      }

      const isPlacingGap = !!player.placingGap

      if (
        lastSection.turning !== player.turning ||
        wasPlacingGap !== isPlacingGap
      ) {
        const point = lastSection.end

        const newSectionCommonProps = {
          start: { ...point },
          end: { ...point },
          startAngle: lastSection.endAngle,
          endAngle: lastSection.endAngle,
          gap: !!player.placingGap,
        }

        if (player.turning === "none") {
          const newSection: Section = {
            ...newSectionCommonProps,
            turning: "none",
          }

          player.line.push(newSection)
          lastSection = newSection
        } else {
          const angleToCenter =
            newSectionCommonProps.endAngle +
            (+90 + turningSpeedDegreesPerTick / 2) * turningModifier

          const arcCenter = {
            x:
              newSectionCommonProps.start.x +
              Math.cos(degreesToRad(angleToCenter)) * arcRadius,
            y:
              newSectionCommonProps.start.y +
              Math.sin(degreesToRad(angleToCenter)) * arcRadius,
          }

          const arcStartAngle = degreesToRad(
            newSectionCommonProps.startAngle +
              (-90 + turningSpeedDegreesPerTick / 2) * turningModifier
          )

          const newSection: Section = {
            ...newSectionCommonProps,
            turning: player.turning,
            arc: {
              center: arcCenter,
              radius: arcRadius,
              startAngle: arcStartAngle,
              endAngle: arcStartAngle,
            },
          }

          player.line.push(newSection)
          lastSection = newSection
        }
      }

      lastSection.endAngle += turningSpeedDegreesPerTick * turningModifier

      lastSection.end.x +=
        Math.cos(degreesToRad(lastSection.endAngle)) * forwardSpeedPixelsPerTick
      lastSection.end.y +=
        Math.sin(degreesToRad(lastSection.endAngle)) * forwardSpeedPixelsPerTick

      if (lastSection.turning !== "none") {
        lastSection.arc.endAngle = degreesToRad(
          lastSection.endAngle +
            (-90 + turningSpeedDegreesPerTick / 2) * turningModifier
        )
      }
    })
  },
  events: {
    playerJoined: (playerId, { game }) => {
      game.players.push(getNewPlayer(playerId, colors[game.players.length]))
    },
    playerLeft: (playerId, { game }) => {
      const index = game.players.findIndex((p) => p.playerId === playerId)
      if (~index) game.players.splice(index, 1)
    },
  },
})

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function getRandomIntBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function degreesToRad(degrees: number) {
  return degrees * (Math.PI / 180)
}

export function findIntersectionPoint(
  line1: { start: Point; end: Point },
  line2: { start: Point; end: Point }
): Point | null {
  const { start: line1Start, end: line1End } = line1
  const { start: line2Start, end: line2End } = line2

  const a1 = line1End.y - line1Start.y
  const b1 = line1Start.x - line1End.x
  const c1 = a1 * line1Start.x + b1 * line1Start.y

  const a2 = line2End.y - line2Start.y
  const b2 = line2Start.x - line2End.x
  const c2 = a2 * line2Start.x + b2 * line2Start.y

  const determinant = a1 * b2 - a2 * b1

  // lines are not parallel
  if (determinant !== 0) {
    const x = (b2 * c1 - b1 * c2) / determinant
    const y = (a1 * c2 - a2 * c1) / determinant

    if (
      Math.min(line1Start.x, line1End.x) <= x &&
      x <= Math.max(line1Start.x, line1End.x) &&
      Math.min(line1Start.y, line1End.y) <= y &&
      y <= Math.max(line1Start.y, line1End.y) &&
      Math.min(line2Start.x, line2End.x) <= x &&
      x <= Math.max(line2Start.x, line2End.x) &&
      Math.min(line2Start.y, line2End.y) <= y &&
      y <= Math.max(line2Start.y, line2End.y)
    ) {
      return { x, y }
    }
  }

  return null
}

function getNewPlayer(playerId: PlayerId, color: string): PlayerInfo {
  const startPoint = {
    x: getRandomInt(boardSize.width),
    y: getRandomInt(boardSize.height),
  }

  const boardCenterX = boardSize.width / 2
  const boardCenterY = boardSize.height / 2

  function getAngleLimits(startPoint: Point): [number, number] {
    return startPoint.x < boardCenterX && startPoint.y < boardCenterY
      ? [0, 90]
      : startPoint.x > boardCenterX && startPoint.y < boardCenterY
      ? [90, 180]
      : startPoint.x < boardCenterX && startPoint.y > boardCenterY
      ? [270, 360]
      : startPoint.x > boardCenterX && startPoint.y > boardCenterY
      ? [180, 270]
      : [0, 360]
  }

  const angle = getRandomIntBetween(...getAngleLimits(startPoint))

  return {
    playerId,
    turning: "none",
    placingGap: 0,
    color,
    line: [
      {
        start: startPoint,
        end: startPoint,
        turning: "none",
        endAngle: angle,
        gap: false,
      },
    ],
  }
}
