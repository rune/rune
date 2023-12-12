import { Point } from "../../logic/types.ts"
import { useCallback } from "react"
import { Graphics as PixiGraphics } from "@pixi/graphics"
import { Container, Graphics } from "@pixi/react"

export function DrawArrow({
  point,
  color,
  scale,
  angle,
}: {
  point: Point
  angle: number
  color: string
  scale: number
}) {
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear()

      g.beginFill(color, 1)

      //M -3.4884 3.4735 C -3.1712 0.423 -0.9514 -5 0 -5 C 0.9514 -5 3.1712 0.423 3.4884 3.4735 C 3.8386 6.8422 -3.8386 6.8422 -3.4884 3.4735 Z
      g.moveTo(-3.4884, 3.4735)
      g.bezierCurveTo(-3.1712, 0.423, -0.9514, -5, 0, -5)
      g.bezierCurveTo(0.9514, -5, 3.1712, 0.423, 3.4884, 3.4735)
      g.bezierCurveTo(3.8386, 6.8422, -3.8386, 6.8422, -3.4884, 3.4735)

      g.endFill()
    },
    [color],
  )

  return (
    <Container angle={angle - 270} x={point.x * scale} y={point.y * scale}>
      <Graphics draw={draw} />
    </Container>
  )
}
