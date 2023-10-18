import { GameState, Section } from "./types.ts"
import {
  minTicksToNextGap,
  gapFrequency,
  gapPlacementDurationTicks,
  turningSpeedDegreesPerTick,
  arcRadius,
  forwardSpeedPixelsPerTick,
} from "./logicConfig.ts"
import { collisionGridPointer } from "./collisionGridHelpers.ts"
import { isLastSectionOutOfBounds } from "./isLastSectionOutOfBounds.ts"
import { checkWinnersAndGameOver } from "./checkWinnersAndGameOver.ts"
import { degreesToRad } from "../lib/degreesToRad.ts"

export function updatePlaying(game: GameState) {
  for (const player of game.players) {
    if (player.state !== "alive") continue

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
          newSectionCommonProps.endAngle +
            (-90 + turningSpeedDegreesPerTick / 2) * turningModifier,
        )

        const newSection: Section = {
          ...newSectionCommonProps,
          turning: player.turning,
          arc: {
            center: arcCenter,
            startAngle: arcStartAngle,
            endAngle: arcStartAngle,
          },
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
      lastSection.arc.endAngle = degreesToRad(
        lastSection.endAngle +
          (-90 + turningSpeedDegreesPerTick / 2) * turningModifier,
      )
    }

    const oldCollisionSquareIndex = collisionGridPointer(oldEnd)
    const collisionSquareIndex = collisionGridPointer(lastSection.end)

    if (
      isLastSectionOutOfBounds(player) ||
      (!lastSection.gap &&
        collisionSquareIndex !== oldCollisionSquareIndex &&
        game.collisionGrid[collisionSquareIndex])
    ) {
      player.state = "dead"
      checkWinnersAndGameOver(game)
    } else if (!lastSection.gap) {
      const oldCollisionCellCords = collisionGridPointer(
        oldCollisionSquareIndex,
      )
      const collisionCellCords = collisionGridPointer(collisionSquareIndex)

      if (
        oldCollisionCellCords.x !== collisionCellCords.x &&
        oldCollisionCellCords.y !== collisionCellCords.y
      ) {
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
          (!lastSectionGoingDown && !lastSectionGoingRight && pointAboveLine) ||
          (lastSectionGoingDown && !lastSectionGoingRight && pointAboveLine) ||
          (!lastSectionGoingDown && lastSectionGoingRight && pointAboveLine)
        ) {
          game.collisionGrid[
            collisionGridPointer({
              x: oldCollisionCellCords.x,
              y: collisionCellCords.y,
            })
          ] = true
        } else {
          game.collisionGrid[
            collisionGridPointer({
              x: collisionCellCords.x,
              y: oldCollisionCellCords.y,
            })
          ] = true
        }
      }

      game.collisionGrid[collisionSquareIndex] = true
    }
  }
}
