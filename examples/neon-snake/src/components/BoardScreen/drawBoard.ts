import { store, $game, $players } from "../../state/state.ts"
import { drawArrow } from "./drawArrow.ts"
import { drawSection } from "./drawSection.ts"
import { drawDeadEnd } from "./drawDeadEnd.ts"
import { drawAvatar } from "./drawAvatar.ts"
import { getOptimisticStartSection } from "./getOptimisticStartSection.ts"

////Draws a board showing collision grid. Useful for testing
// function highlightCollisionGrid(
//   game: GameState,
//   canvas: HTMLCanvasElement,
//   ctx: CanvasRenderingContext2D,
//   scale: number,
// ) {
//   for (let i = 0; i < boardSize.height / collisionGridSize; i++) {
//     // Start a new Path
//     ctx.beginPath()
//     ctx.lineWidth = 0.2
//     ctx.moveTo(0, i * collisionGridSize * scale)
//     ctx.lineTo(canvas.width, i * collisionGridSize * scale)
//
//     // Draw the Path
//     ctx.stroke()
//   }
//
//   for (let i = 0; i < boardSize.width / collisionGridSize; i++) {
//     // Start a new Path
//     ctx.beginPath()
//     ctx.lineWidth = 0.2
//     ctx.moveTo(i * collisionGridSize * scale, 0)
//     ctx.lineTo(i * collisionGridSize * scale, canvas.height)
//
//     // Draw the Path
//     ctx.stroke()
//   }
//
//   for (let i = 0; i < boardSize.height / collisionGridSize; i++) {
//     for (let j = 0; j < boardSize.height / collisionGridSize; j++) {
//       if (game.collisionGrid[i]?.[j]) {
//         ctx.fillStyle = "red"
//         ctx.beginPath()
//         ctx.rect(
//           i * collisionGridSize * scale,
//           j * collisionGridSize * scale,
//           collisionGridSize * scale,
//           collisionGridSize * scale,
//         )
//         ctx.fill()
//       }
//     }
//   }
// }

export function drawBoard(canvas: HTMLCanvasElement, scale: number) {
  const ctx = canvas.getContext("2d")
  const game = store.get($game)

  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // highlightCollisionGrid(game, canvas, ctx, scale)

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
      for (const section of snake.sections) {
        if (section.gap) continue
        drawSection(ctx, scale, section, player.color)
      }

      if (player.state === "alive") {
        const latestSection = { ...snake.sections[snake.sections.length - 1] }

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
    const latestSection = { ...snake.sections[snake.sections.length - 1] }

    drawDeadEnd(ctx, scale, latestSection.end, player.color, player.diedAt)
  }
}
