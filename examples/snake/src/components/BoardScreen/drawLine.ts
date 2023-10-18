import { Point } from "../../logic/types.ts"

export function drawLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  color: string,
) {
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = 10 * window.devicePixelRatio
  ctx.shadowColor = color

  ctx.stroke()
  ctx.stroke()
}
