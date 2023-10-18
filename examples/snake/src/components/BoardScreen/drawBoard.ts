import { store, $game, $players } from "../../state/state.ts"
import { drawArrow } from "./drawArrow.ts"
import { degreesToRad } from "../../lib/helpers.ts"
import { drawSection } from "./drawSection.ts"
import { drawCollisionGrid } from "./drawCollisionGrid.ts"
import { drawDead } from "./drawDead.ts"
import { drawAvatar } from "./drawAvatar.ts"
import {
  arcRadius,
  turningSpeedDegreesPerTick,
  forwardSpeedPixelsPerTick,
} from "../../logic/logicConfig.ts"

const showCollisionGrid = false

export function drawBoard(canvas: HTMLCanvasElement, scale: number) {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const game = store.get($game)

  if (showCollisionGrid) {
    drawCollisionGrid(ctx, scale, game.collisionGrid)
  }

  for (const player of game.players) {
    if (player.state === "pending") continue

    for (const section of player.line) {
      if (section.gap) continue

      drawSection(ctx, scale, section, player.color)
    }
  }

  for (const player of game.players) {
    if (player.state === "pending") continue

    const lastSection = { ...player.line[player.line.length - 1] }

    if (game.stage === "countdown") {
      const turningModifier =
        player.turning === "none" ? 0 : player.turning === "right" ? 1 : -1

      const optimisticIterations = 5

      const oldAngle = lastSection.endAngle

      for (let i = 0; i < optimisticIterations; i++) {
        lastSection.turning = player.turning
        lastSection.endAngle =
          lastSection.endAngle + turningSpeedDegreesPerTick * turningModifier
        lastSection.end = {
          x:
            lastSection.end.x +
            Math.cos(degreesToRad(lastSection.endAngle)) *
              forwardSpeedPixelsPerTick,
          y:
            lastSection.end.y +
            Math.sin(degreesToRad(lastSection.endAngle)) *
              forwardSpeedPixelsPerTick,
        }

        if (lastSection.turning !== "none") {
          const angleToCenter =
            oldAngle + (+90 + turningSpeedDegreesPerTick / 2) * turningModifier

          lastSection.arcCenter = {
            x:
              lastSection.start.x +
              Math.cos(degreesToRad(angleToCenter)) * arcRadius,
            y:
              lastSection.start.y +
              Math.sin(degreesToRad(angleToCenter)) * arcRadius,
          }
          lastSection.arcStartAngle = degreesToRad(
            oldAngle + (-90 + turningSpeedDegreesPerTick / 2) * turningModifier,
          )
          lastSection.arcEndAngle = degreesToRad(
            lastSection.endAngle +
              (-90 + turningSpeedDegreesPerTick / 2) * turningModifier,
          )
        }
      }

      drawSection(ctx, scale, lastSection, player.color)

      const avatarUrl = store.get($players)[player.playerId].avatarUrl

      drawAvatar(ctx, scale, avatarUrl, lastSection.start, player.color)
    }

    if (player.state === "alive") {
      drawArrow(ctx, scale, lastSection.end, lastSection.endAngle, player.color)
    } else {
      drawDead(ctx, scale, lastSection.end, player.color)
    }
  }
}
