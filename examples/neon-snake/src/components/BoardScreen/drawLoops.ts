import { easeOutCubic } from "../../lib/easeOutCubic.ts"
import { clamp } from "../../lib/clamp.ts"
import { remap } from "../../lib/remap.ts"
import { Point } from "../../logic/types.ts"

const loopInterval = 1000
const loopDuration = 3000

export function drawLoops(
  ctx: CanvasRenderingContext2D,
  scale: number,
  point: Point,
  timerStartedAt: number,
  color: string,
) {
  const loops =
    Math.floor((Rune.gameTime() - timerStartedAt) / loopInterval) + 1

  for (let i = 0; i < loops; i++) {
    const msStart = i * loopInterval
    ctx.beginPath()
    ctx.strokeStyle = color

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

    ctx.globalAlpha = 1 - x

    ctx.arc(point.x * scale, point.y * scale, 30 * x, 2 * Math.PI, 0)

    ctx.stroke()
  }

  ctx.globalAlpha = 1
}
