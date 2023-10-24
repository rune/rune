import { Snake } from "./types.ts"
import { boardSize } from "./logicConfig.ts"

export function isLatestSectionOutOfBounds(snake: Snake) {
  const latestSection = snake.sections[snake.sections.length - 1]

  return (
    latestSection.end.x < 0 ||
    latestSection.end.x >= boardSize.width ||
    latestSection.end.y < 0 ||
    latestSection.end.y >= boardSize.height
  )
}
