import { Point } from "../../logic/types.ts"

export function drawRect(
  ctx: CanvasRenderingContext2D,
  point: Point,
  width: number,
  height: number,
  color: string,
  fillColor?: string,
) {
  ctx.beginPath()
  ctx.rect(point.x, point.y, width, height)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = 0
  ctx.stroke()

  if (fillColor) {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
}
