import { Snake } from "../types.ts"
import {
  minTicksToNextGap,
  gapFrequency,
  gapPlacementDurationTicks,
} from "../logicConfig.ts"

export function updateSnakePlacingGap(snake: Snake) {
  const wasPlacingGap = snake.gapCounter > 0

  if (snake.gapCounter < -minTicksToNextGap) {
    if (Math.random() < gapFrequency) {
      snake.gapCounter = gapPlacementDurationTicks
    }
  }

  snake.gapCounter--

  const isPlacingGap = snake.gapCounter > 0

  return { wasPlacingGap, isPlacingGap }
}
