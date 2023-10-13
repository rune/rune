import { degreesToRad } from "../lib/helpers.ts"
import { getNewPlayer } from "./getNewPlayer.ts"
import { Section, PlayerInfo, Turning } from "./types.ts"
import { RuneClient } from "rune-games-sdk"

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

export const arcRadius =
  (180 * forwardSpeedPixelsPerTick) / (Math.PI * turningSpeedDegreesPerTick)

const gapFrequency = 0.01
const gapLength = 15
const minDistanceToNextGap = 30

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

      const wasPlacingGap = player.gapCounter > 0

      if (player.gapCounter < -minDistanceToNextGap) {
        if (Math.random() < gapFrequency) {
          player.gapCounter = gapLength
        }
      }

      player.gapCounter--

      const isPlacingGap = player.gapCounter > 0

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
          gap: player.gapCounter > 0,
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
            arcCenter,
            arcStartAngle,
            arcEndAngle: arcStartAngle,
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
        lastSection.arcEndAngle = degreesToRad(
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
