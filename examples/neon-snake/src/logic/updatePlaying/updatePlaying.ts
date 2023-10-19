import { GameState } from "../types.ts"
import { getNextSection } from "./getNextSection.ts"
import { updateSnakePlacingGap } from "./updateSnakePlacingGap.ts"
import { updateSectionTail } from "./updateSectionTail.ts"
import { checkLatestSectionForCollisions } from "./checkLatestSectionForCollisions.ts"

export function updatePlaying(game: GameState) {
  for (const player of game.players) {
    if (player.state !== "alive") continue

    const snake = game.snakes[player.playerId]

    let latestSection = snake.line[snake.line.length - 1]

    const { wasPlacingGap, isPlacingGap } = updateSnakePlacingGap(snake)

    if (
      latestSection.turning !== snake.turning ||
      wasPlacingGap !== isPlacingGap
    ) {
      snake.line.push(
        getNextSection(latestSection, snake.turning, isPlacingGap),
      )
      latestSection = snake.line[snake.line.length - 1]
    }

    const oldTail = { ...latestSection.end }

    updateSectionTail(latestSection)

    checkLatestSectionForCollisions(oldTail, player, game)
  }
}
