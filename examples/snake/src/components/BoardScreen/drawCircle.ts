import { Point } from "../../logic/types.ts"

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string,
  radius: number,
) {
  ctx.beginPath()
  ctx.arc(point.x, point.y, radius * window.devicePixelRatio, 0, 2 * Math.PI)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 10 * window.devicePixelRatio

  ctx.fill()
  ctx.fill()
}
