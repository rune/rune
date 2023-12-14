import { Point } from "../../logic/types.ts"
import { useCallback, useState } from "react"
import { Graphics as PixiGraphics } from "@pixi/graphics"
import {
  avatarRadius,
  deathRevealDelayMs,
  defaultTransitionMs,
} from "./drawConfig.ts"
import { Container, Graphics, Sprite, useTick } from "@pixi/react"
import { easeOutCubic } from "../../lib/easeOutCubic.ts"
import { clamp } from "../../lib/clamp.ts"
import { remap } from "../../lib/remap.ts"

export function DrawDeadEnd({
  point,
  color,
  scale,
  diedAt,
}: {
  point: Point
  color: string
  scale: number
  diedAt: number | undefined
}) {
  const [alpha, setAlpha] = useState(0)

  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear()

      g.beginFill(color, 1)

      g.drawCircle(0, 0, avatarRadius * scale)

      g.endFill()
    },
    [color, scale],
  )

  useTick(() => {
    if (!diedAt || alpha === 1) {
      return
    }

    setAlpha(
      easeOutCubic(
        clamp(
          remap(
            Rune.gameTime(),
            [
              diedAt + deathRevealDelayMs,
              diedAt + deathRevealDelayMs + defaultTransitionMs,
            ],
            [0, 1],
          ),
          [0, 1],
        ),
      ),
    )
  })

  return (
    <Container alpha={alpha} x={point.x * scale} y={point.y * scale}>
      <Graphics draw={draw} />
      <Sprite
        image="skull.png"
        width={(avatarRadius - 2) * 2 * scale}
        height={(avatarRadius - 2) * 2 * scale}
        anchor={0.5}
        tint={0x000000}
      />
    </Container>
  )
}
