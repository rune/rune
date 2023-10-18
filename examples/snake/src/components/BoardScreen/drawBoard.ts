import { store, $game, $players } from "../../state/state.ts"
import {
  arcRadius,
  collisionGridIndexToPoint,
  pixelsPerCollisionGridSquare,
  turningSpeedDegreesPerTick,
  forwardSpeedPixelsPerTick,
} from "../../logic/logic.ts"
import { drawArc } from "./drawArc.ts"
import { drawLine } from "./drawLine.ts"
import { drawArrow } from "./drawArrow.ts"
import { drawCircle } from "./drawCircle.ts"
import { drawRect } from "./drawRect.ts"
import { degreesToRad } from "../../lib/helpers.ts"

const showCollisionGrid = false

const images = new Map<string, HTMLImageElement>()

export function drawBoard(canvas: HTMLCanvasElement, scale: number) {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const game = store.get($game)

  if (showCollisionGrid) {
    for (
      let cellIndex = 0;
      cellIndex < game.collisionGrid.length;
      cellIndex++
    ) {
      const point = collisionGridIndexToPoint(cellIndex)

      drawRect(
        ctx,
        { x: point.x * scale, y: point.y * scale },
        pixelsPerCollisionGridSquare * scale,
        pixelsPerCollisionGridSquare * scale,
        "rgba(255,255,255,.1)",
        game.collisionGrid[cellIndex] ? "rgba(255,255,255,.5)" : undefined,
      )
    }
  }

  for (const player of game.players) {
    if (player.state === "pending") continue

    for (const section of player.line) {
      if (section.gap) continue

      if (section.turning !== "none") {
        drawArc(
          ctx,
          section.arcCenter.x * scale,
          section.arcCenter.y * scale,
          arcRadius * scale,
          section.arcStartAngle,
          section.arcEndAngle,
          section.turning === "left",
          player.color,
        )
      } else {
        drawLine(
          ctx,
          { x: section.start.x * scale, y: section.start.y * scale },
          { x: section.end.x * scale, y: section.end.y * scale },
          player.color,
        )
      }
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

      if (lastSection.turning !== "none") {
        drawArc(
          ctx,
          lastSection.arcCenter.x * scale,
          lastSection.arcCenter.y * scale,
          arcRadius * scale,
          lastSection.arcStartAngle,
          lastSection.arcEndAngle,
          lastSection.turning === "left",
          player.color,
        )
      } else {
        drawLine(
          ctx,
          { x: lastSection.start.x * scale, y: lastSection.start.y * scale },
          { x: lastSection.end.x * scale, y: lastSection.end.y * scale },
          player.color,
        )
      }

      const avatarUrl = store.get($players)[player.playerId].avatarUrl

      if (!images.has(avatarUrl)) {
        const image = new Image()
        image.src = avatarUrl
        images.set(avatarUrl, image)
      }

      const image = images.get(avatarUrl)

      if (image) {
        drawCircle(
          ctx,
          {
            x: lastSection.start.x * scale,
            y: lastSection.start.y * scale,
          },
          player.color,
          10 + 1,
        )

        ctx.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          lastSection.start.x * scale - 10 * window.devicePixelRatio,
          lastSection.start.y * scale - 10 * window.devicePixelRatio,
          20 * window.devicePixelRatio,
          20 * window.devicePixelRatio,
        )
      }
    }

    if (player.state === "alive") {
      drawArrow(
        ctx,
        { x: lastSection.end.x * scale, y: lastSection.end.y * scale },
        lastSection.endAngle,
        player.color,
      )
    } else {
      drawCircle(
        ctx,
        { x: lastSection.end.x * scale, y: lastSection.end.y * scale },
        player.color,
        7.5,
      )
    }
  }
}
