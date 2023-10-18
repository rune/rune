import { Point } from "../../logic/types.ts"

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  point: Point,
  angle: number,
  color: string,
) {
  const arrowWidth = 8.41
  const arrowPath =
    "M3.29626 0.923214C3.74166 -0.149229 5.43456 -0.115187 5.82663 0.974098L8.44648 8.25278C8.78118 9.18266 8.46881 10.2164 7.53811 10.7162C6.70522 11.1634 5.63292 11.6043 4.642 11.6043C3.56881 11.6043 2.35189 11.1758 1.38414 10.7351C0.299816 10.2414 -0.0889469 9.07425 0.337459 8.04753L3.29626 0.923214Z"

  const arrow = new Path2D()
  const transforms = new DOMMatrix()

  transforms.translateSelf(point.x, point.y)
  transforms.scaleSelf(window.devicePixelRatio)
  transforms.rotateSelf(angle - 270)
  transforms.translateSelf(-arrowWidth / 2, -1) // -1 to shift the arrow forward a bit, so it's tip isn't mixed with the line end

  arrow.addPath(new Path2D(arrowPath), transforms)

  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 10 * window.devicePixelRatio

  ctx.fill(arrow)
  ctx.fill(arrow)
}
