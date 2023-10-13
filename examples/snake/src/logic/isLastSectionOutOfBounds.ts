import { PlayerInfo } from "./types.ts"
import { boardSize } from "./logic.ts"

export function isLastSectionOutOfBounds(player: PlayerInfo) {
  const lastSection = player.line[player.line.length - 1]

  return (
    lastSection.end.x < 0 ||
    lastSection.end.x >= boardSize.width ||
    lastSection.end.y < 0 ||
    lastSection.end.y >= boardSize.height
  )
}
