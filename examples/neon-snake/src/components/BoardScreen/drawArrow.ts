import { Point } from "../../logic/types.ts"
import { shadowBlur } from "./drawConfig.ts"
import { fadeRgbaColor } from "./fadeRgbaColor.ts"

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  scale: number,
  tip: Point,
  angle: number,
  color: string,
  isOpponent: boolean,
) {
  const arrowWidth = 7
  const arrowPath =
    "M0.011631 8.4735C0.328755 5.42304 2.54863 0 3.5 0C4.45138 0 6.67125 5.42304 6.98837 8.4735C7.33857 11.8422 -0.338574 11.8422 0.011631 8.4735Z"

  const arrow = new Path2D()
  const transforms = new DOMMatrix()

  transforms.translateSelf(tip.x * scale, tip.y * scale)
  transforms.scaleSelf(window.devicePixelRatio)
  transforms.rotateSelf(angle - 270)
  transforms.translateSelf(-arrowWidth / 2, -1) // -1 to shift the arrow forward a bit, so it's tip isn't mixed with the line end

  arrow.addPath(new Path2D(arrowPath), transforms)

  ctx.fillStyle = isOpponent ? fadeRgbaColor(color, "0.7") : color
  ctx.shadowColor = color
  ctx.shadowBlur = shadowBlur * window.devicePixelRatio

  ctx.fill(arrow)
  ctx.fill(arrow)
}
