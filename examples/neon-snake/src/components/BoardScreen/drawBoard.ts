import { store, $game, $players } from "../../state/state.ts"
import { drawArrow } from "./drawArrow.ts"
import { drawSection } from "./drawSection.ts"
import { drawDeadEnd } from "./drawDeadEnd.ts"
import { drawAvatar } from "./drawAvatar.ts"
import { getOptimisticStartSection } from "./getOptimisticStartSection.ts"

export function drawBoard(canvas: HTMLCanvasElement, scale: number) {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const game = store.get($game)

  for (const player of game.players) {
    if (player.state === "pending") continue

    const snake = game.snakes[player.playerId]

    if (game.stage === "countdown") {
      const optimisticSection = getOptimisticStartSection(snake)
      const avatarUrl = store.get($players)[player.playerId].avatarUrl

      drawSection(ctx, scale, optimisticSection, player.color)
      drawAvatar(ctx, scale, avatarUrl, optimisticSection.start, player.color)
      drawArrow(
        ctx,
        scale,
        optimisticSection.end,
        optimisticSection.endAngle,
        player.color,
      )
    } else {
      for (const section of snake.line) {
        if (section.gap) continue
        drawSection(ctx, scale, section, player.color)
      }

      if (player.state === "alive") {
        const latestSection = { ...snake.line[snake.line.length - 1] }

        drawArrow(
          ctx,
          scale,
          latestSection.end,
          latestSection.endAngle,
          player.color,
        )
      }
    }
  }

  for (const player of game.players) {
    if (player.state !== "dead") continue

    const snake = game.snakes[player.playerId]
    const latestSection = { ...snake.line[snake.line.length - 1] }

    drawDeadEnd(ctx, scale, latestSection.end, player.color)
  }
}
