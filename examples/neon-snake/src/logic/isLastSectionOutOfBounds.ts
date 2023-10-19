import { Snake } from "./types.ts"

import { boardSize } from "./logicConfig.ts"

export function isLastSectionOutOfBounds(snake: Snake) {
  const lastSection = snake.line[snake.line.length - 1]

  return (
    lastSection.end.x < 0 ||
    lastSection.end.x >= boardSize.width ||
    lastSection.end.y < 0 ||
    lastSection.end.y >= boardSize.height
  )
}
