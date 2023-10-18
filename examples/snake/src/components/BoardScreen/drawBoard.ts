import { store, $game } from "../../state/state.ts"
import {
  arcRadius,
  collisionGridIndexToPoint,
  pixelsPerCollisionGridSquare,
} from "../../logic/logic.ts"
import { drawArc } from "./drawArc.ts"
import { drawLine } from "./drawLine.ts"
import { drawArrow } from "./drawArrow.ts"
import { drawCircle } from "./drawCircle.ts"
import { drawRect } from "./drawRect.ts"

const showCollisionGrid = false

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

    const lastSection = player.line[player.line.length - 1]

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
      )
    }
  }
}
