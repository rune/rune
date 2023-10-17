import { degreesToRad, radToDegrees } from "../lib/helpers.ts"
import { getNewPlayer } from "./getNewPlayer.ts"
import { Section, PlayerInfo, Turning, Point } from "./types.ts"
import { RuneClient } from "rune-games-sdk"
import { isLastSectionOutOfBounds } from "./isLastSectionOutOfBounds.ts"
import { findIntersectionPoint } from "./findIntersectionPoint.ts"

export interface GameState {
  players: PlayerInfo[]
  collisionGrid: boolean[]
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

const speed = 1 / 3

export const forwardSpeedPixelsPerTick = 3 / speed
export const turningSpeedDegreesPerTick = 3 / speed

export const arcRadius =
  (180 * forwardSpeedPixelsPerTick) / (Math.PI * turningSpeedDegreesPerTick)

const gapFrequency = 0.01 / speed
const gapPlacementDurationTicks = 20 * speed
const minTicksToNextGap = 30 * speed

const colors = ["#BCFE00", "#10D4FF", "#FF32D2", "#FF9C27"]

export const pixelsPerCollisionGridSquare = Math.round(
  forwardSpeedPixelsPerTick * 1.5,
) // TODO: could be 1:1 if we fix serialization issue?
function pointToCollisionGridIndex(point: Point) {
  return (
    Math.floor(point.x / pixelsPerCollisionGridSquare) *
      Math.floor(boardSize.height / pixelsPerCollisionGridSquare) +
    Math.floor(point.y / pixelsPerCollisionGridSquare)
  )
}

export function collisionGridIndexToPoint(index: number) {
  const x = Math.floor(
    index / Math.floor(boardSize.height / pixelsPerCollisionGridSquare),
  )
  const y = index % Math.floor(boardSize.height / pixelsPerCollisionGridSquare)

  return {
    x: x * pixelsPerCollisionGridSquare,
    y: y * pixelsPerCollisionGridSquare,
  }
}

Rune.initLogic({
  minPlayers: 4,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const collisionGrid: boolean[] = []

    for (let x = 0; x < boardSize.width; x++) {
      if (x % pixelsPerCollisionGridSquare !== 0) continue

      for (let y = 0; y < boardSize.height; y++) {
        if (y % pixelsPerCollisionGridSquare !== 0) continue

        const index = pointToCollisionGridIndex({ x, y })

        collisionGrid[index] = false
      }
    }

    return {
      players: allPlayerIds.map((playerId, index) =>
        getNewPlayer(playerId, colors[index]),
      ),
      collisionGrid,
    }
  },
  actions: {
    setTurning: (turning, { game, playerId }) => {
      const player = game.players.find((p) => p.playerId === playerId)

      if (!player) throw Rune.invalidAction()

      player.turning = turning
    },
  },
  updatesPerSecond: Math.round(30 * speed),
  update: ({ game }) => {
    for (const player of game.players) {
      if (player.state === "dead") continue

      let lastSection = player.line[player.line.length - 1]

      const turningModifier =
        player.turning === "none" ? 0 : player.turning === "right" ? 1 : -1

      const wasPlacingGap = player.gapCounter > 0

      if (player.gapCounter < -minTicksToNextGap) {
        if (Math.random() < gapFrequency) {
          player.gapCounter = gapPlacementDurationTicks
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
              (-90 + turningSpeedDegreesPerTick / 2) * turningModifier,
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

      const oldEnd = { ...lastSection.end }

      lastSection.end.x +=
        Math.cos(degreesToRad(lastSection.endAngle)) * forwardSpeedPixelsPerTick
      lastSection.end.y +=
        Math.sin(degreesToRad(lastSection.endAngle)) * forwardSpeedPixelsPerTick

      if (lastSection.turning !== "none") {
        lastSection.arcEndAngle = degreesToRad(
          lastSection.endAngle +
            (-90 + turningSpeedDegreesPerTick / 2) * turningModifier,
        )
      }

      const oldCollisionSquareIndex = pointToCollisionGridIndex(oldEnd)
      const collisionSquareIndex = pointToCollisionGridIndex(lastSection.end)

      // TODO when moving diagonally between two collision squares, we need to
      //  check which one of the remaining two squares to mark (and also check) because a line has crossed it

      if (
        isLastSectionOutOfBounds(player) ||
        (!lastSection.gap &&
          collisionSquareIndex !== oldCollisionSquareIndex &&
          game.collisionGrid[collisionSquareIndex])
      ) {
        player.state = "dead"
      } else if (!lastSection.gap) {
        const oldCollisionCellCords = collisionGridIndexToPoint(
          oldCollisionSquareIndex,
        )
        const collisionCellCords =
          collisionGridIndexToPoint(collisionSquareIndex)

        if (
          oldCollisionCellCords.x !== collisionCellCords.x &&
          oldCollisionCellCords.y !== collisionCellCords.y
        ) {
          // TODO: only mark one of the remaining squares depending on which one the line crossed

          const point =
            collisionCellCords.x > oldCollisionCellCords.y &&
            collisionCellCords.y > oldCollisionCellCords.y
              ? {
                  ...collisionCellCords,
                }
              : collisionCellCords.x < oldCollisionCellCords.y &&
                collisionCellCords.y < oldCollisionCellCords.y
              ? {
                  ...oldCollisionCellCords,
                }
              : collisionCellCords.x > oldCollisionCellCords.y &&
                collisionCellCords.y < oldCollisionCellCords.y
              ? {
                  x: collisionCellCords.x,
                  y: oldCollisionCellCords.y,
                }
              : {
                  x: oldCollisionCellCords.x,
                  y: collisionCellCords.y,
                }

          const lastSectionLineEquation = {
            a: (lastSection.end.y - oldEnd.y) / (lastSection.end.x - oldEnd.x),
            b:
              lastSection.end.y -
              (lastSection.end.x * (lastSection.end.y - oldEnd.y)) /
                (lastSection.end.x - oldEnd.x),
          }

          const pointAboveLine =
            point.y >
            lastSectionLineEquation.a * point.x + lastSectionLineEquation.b

          const lastSectionGoingDown = lastSection.end.y > oldEnd.y
          const lastSectionGoingRight = lastSection.end.x > oldEnd.x

          if (
            (lastSectionGoingDown && lastSectionGoingRight && pointAboveLine) ||
            (!lastSectionGoingDown &&
              !lastSectionGoingRight &&
              pointAboveLine) ||
            (lastSectionGoingDown &&
              !lastSectionGoingRight &&
              pointAboveLine) ||
            (!lastSectionGoingDown && lastSectionGoingRight && pointAboveLine)
          ) {
            game.collisionGrid[
              pointToCollisionGridIndex({
                x: oldCollisionCellCords.x,
                y: collisionCellCords.y,
              })
            ] = true
          } else {
            game.collisionGrid[
              pointToCollisionGridIndex({
                x: collisionCellCords.x,
                y: oldCollisionCellCords.y,
              })
            ] = true
          }

          console.log("diagonal")
        }

        game.collisionGrid[collisionSquareIndex] = true
      }
    }

    if (game.players.every((p) => p.state === "dead")) Rune.gameOver()
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

function isLastSectionIntersectsWithOther(
  player: PlayerInfo,
  players: PlayerInfo[],
) {
  const lastSection = player.line[player.line.length - 1]

  if (lastSection.gap) return false

  for (const otherPlayer of players) {
    for (const otherSection of otherPlayer.line) {
      if (otherSection.gap) continue

      const lastSectionLastLine = {
        start: {
          x:
            lastSection.end.x +
            Math.cos(degreesToRad(lastSection.endAngle - 180)) *
              forwardSpeedPixelsPerTick,
          y:
            lastSection.end.y +
            Math.sin(degreesToRad(lastSection.endAngle - 180)) *
              forwardSpeedPixelsPerTick,
        },
        end: { ...lastSection.end },
      }

      if (otherSection.turning !== "none") {
        const lastSectionEnd = lastSectionLastLine.end
        const arcCenter = otherSection.arcCenter
        const distanceToCenter = Math.sqrt(
          (lastSectionEnd.x - arcCenter.x) ** 2 +
            (lastSectionEnd.y - arcCenter.y) ** 2,
        )

        if (distanceToCenter > arcRadius) continue
      }

      const otherSectionLines =
        otherSection.turning === "none"
          ? [otherSection]
          : curvedSectionToLines(otherSection)

      for (const line of otherSectionLines) {
        if (findIntersectionPoint(lastSectionLastLine, line)) return true
      }
    }
  }

  return false
}

function curvedSectionToLines(
  section: Section & { turning: "left" | "right" },
) {
  const iterations =
    Math.abs(
      section.turning === "left"
        ? radToDegrees(section.arcStartAngle) -
            radToDegrees(section.arcEndAngle)
        : radToDegrees(section.arcEndAngle) -
            radToDegrees(section.arcStartAngle),
    ) / turningSpeedDegreesPerTick

  const lines: { start: Point; end: Point }[] = []
  let startPoint = { ...section.end }
  const turningModifier = section.turning === "right" ? 1 : -1
  let angle = section.endAngle - 180

  for (let i = 0; i < iterations; i++) {
    const endPoint = {
      x:
        startPoint.x +
        Math.cos(degreesToRad(angle)) * forwardSpeedPixelsPerTick,
      y:
        startPoint.y +
        Math.sin(degreesToRad(angle)) * forwardSpeedPixelsPerTick,
    }
    const line = { start: { ...startPoint }, end: endPoint }
    startPoint = { ...endPoint }
    angle -= turningSpeedDegreesPerTick * turningModifier

    lines.push(line)
  }

  return lines
}
