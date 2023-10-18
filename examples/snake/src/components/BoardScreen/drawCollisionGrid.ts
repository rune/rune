import { pixelsPerCollisionGridSquare } from "../../logic/logicConfig.ts"
import { collisionGridPointer } from "../../logic/collisionGridHelpers.ts"

export function drawCollisionGrid(
  ctx: CanvasRenderingContext2D,
  scale: number,
  collisionGrid: boolean[],
) {
  for (let cellIndex = 0; cellIndex < collisionGrid.length; cellIndex++) {
    const point = collisionGridPointer(cellIndex)

    ctx.beginPath()
    ctx.rect(
      point.x * scale,
      point.y * scale,
      pixelsPerCollisionGridSquare * scale,
      pixelsPerCollisionGridSquare * scale,
    )

    ctx.lineWidth = 2 * window.devicePixelRatio
    ctx.strokeStyle = "rgba(255,255,255,.1)"
    ctx.stroke()

    if (collisionGrid[cellIndex]) {
      ctx.fillStyle = "rgba(255,255,255,.5)"
      ctx.fill()
    }
  }
}
