import { Snake } from "../types.ts"
import {
  minTicksToNextGap,
  gapChancePerTick,
  gapLengthTicks,
} from "../logicConfig.ts"

export function updateSnakePlacingGap(snake: Snake) {
  const wasPlacingGap = snake.gapCounter > 0

  if (snake.gapCounter < -minTicksToNextGap) {
    if (Math.random() < gapChancePerTick) {
      snake.gapCounter = gapLengthTicks
    }
  }

  snake.gapCounter--

  const isPlacingGap = snake.gapCounter > 0

  return { wasPlacingGap, isPlacingGap }
}
