import { Snake } from "../types.ts"
import {
  minTicksToNextGap,
  gapChancePerTick,
  placeGapForTicks,
} from "../logicConfig.ts"

export function updateSnakePlacingGap(snake: Snake) {
  const wasPlacingGap = snake.gapCounter > 0

  if (snake.gapCounter < -minTicksToNextGap) {
    if (Math.random() < gapChancePerTick) {
      snake.gapCounter = placeGapForTicks
    }
  }

  snake.gapCounter--

  const isPlacingGap = snake.gapCounter > 0

  return { wasPlacingGap, isPlacingGap }
}
