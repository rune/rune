import { useState } from "react"
import { Graphics, useTick } from "@pixi/react"
import { Graphics as PixiGraphics } from "@pixi/graphics"
import { easeOutCubic } from "../../lib/easeOutCubic.ts"
import { clamp } from "../../lib/clamp.ts"
import { remap } from "../../lib/remap.ts"

const loopInterval = 1000
const loopDuration = 3000

export function DrawLoops({
  color,
  scale,
  timerStartedAt,
}: {
  color: string
  scale: number
  timerStartedAt: number
}) {
  const [render, setRender] = useState(0)

  useTick(() => {
    setRender(render + 1)
  })

  const draw = (g: PixiGraphics) => {
    g.clear()

    const loops =
      Math.floor((Rune.gameTime() - timerStartedAt) / loopInterval) + 1

    for (let i = 0; i < loops; i++) {
      const msStart = i * loopInterval

      const x = easeOutCubic(
        clamp(
          remap(
            Rune.gameTime(),
            [timerStartedAt + msStart, timerStartedAt + loopDuration + msStart],
            [0, 1],
          ),
          [0, 1],
        ),
      )

      g.lineStyle(scale, color, 1 - x)

      g.drawCircle(0, 0, 30 * x)
    }
  }

  return <Graphics draw={draw} />
}
