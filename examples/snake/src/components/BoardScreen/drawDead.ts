import { Point } from "../../logic/types.ts"
import { shadowBlur, deadCircleRadius } from "./drawConfig.ts"

export function drawDead(
  ctx: CanvasRenderingContext2D,
  scale: number,
  point: Point,
  color: string,
) {
  ctx.beginPath()
  ctx.arc(
    point.x * scale,
    point.y * scale,
    deadCircleRadius * window.devicePixelRatio,
    0,
    2 * Math.PI,
  )

  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = shadowBlur * window.devicePixelRatio

  ctx.fill()
  ctx.fill()
}
