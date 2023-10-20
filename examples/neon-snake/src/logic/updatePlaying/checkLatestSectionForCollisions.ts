import { Point, PlayerInfo, GameState } from "../types.ts"
import { collisionGridPointer } from "../collisionGridHelpers.ts"
import { isLatestSectionOutOfBounds } from "../isLatestSectionOutOfBounds.ts"
import { checkWinnersAndGameOver } from "../checkWinnersAndGameOver.ts"

export function checkLatestSectionForCollisions(
  oldTail: Point,
  player: PlayerInfo,
  game: GameState,
) {
  const snake = game.snakes[player.playerId]
  const latestSection = snake.sections[snake.sections.length - 1]

  const oldCollisionSquareIndex = collisionGridPointer(oldTail)
  const collisionSquareIndex = collisionGridPointer(latestSection.end)

  if (
    isLatestSectionOutOfBounds(snake) ||
    (!latestSection.gap &&
      collisionSquareIndex !== oldCollisionSquareIndex &&
      game.collisionGrid[collisionSquareIndex])
  ) {
    player.state = "dead"
    checkWinnersAndGameOver(game)
  } else if (!latestSection.gap) {
    const oldCollisionCellCords = collisionGridPointer(oldCollisionSquareIndex)
    const collisionCellCords = collisionGridPointer(collisionSquareIndex)

    if (
      oldCollisionCellCords.x !== collisionCellCords.x &&
      oldCollisionCellCords.y !== collisionCellCords.y
    ) {
      const point =
        collisionCellCords.x > oldCollisionCellCords.y &&
        collisionCellCords.y > oldCollisionCellCords.y
          ? {
              ...collisionCellCords,
            }
          : collisionCellCords.x < oldCollisionCellCords.y &&
            collisionCellCords.y < oldCollisionCellCords.y
          ? {
              ...oldCollisionCellCords,
            }
          : collisionCellCords.x > oldCollisionCellCords.y &&
            collisionCellCords.y < oldCollisionCellCords.y
          ? {
              x: collisionCellCords.x,
              y: oldCollisionCellCords.y,
            }
          : {
              x: oldCollisionCellCords.x,
              y: collisionCellCords.y,
            }

      const latestSectionLineEquation = {
        a:
          (latestSection.end.y - oldTail.y) / (latestSection.end.x - oldTail.x),
        b:
          latestSection.end.y -
          (latestSection.end.x * (latestSection.end.y - oldTail.y)) /
            (latestSection.end.x - oldTail.x),
      }

      const pointAboveLine =
        point.y >
        latestSectionLineEquation.a * point.x + latestSectionLineEquation.b

      const latestSectionGoingDown = latestSection.end.y > oldTail.y
      const latestSectionGoingRight = latestSection.end.x > oldTail.x

      if (
        (latestSectionGoingDown && latestSectionGoingRight && pointAboveLine) ||
        (!latestSectionGoingDown &&
          !latestSectionGoingRight &&
          pointAboveLine) ||
        (latestSectionGoingDown &&
          !latestSectionGoingRight &&
          pointAboveLine) ||
        (!latestSectionGoingDown && latestSectionGoingRight && pointAboveLine)
      ) {
        game.collisionGrid[
          collisionGridPointer({
            x: oldCollisionCellCords.x,
            y: collisionCellCords.y,
          })
        ] = true
      } else {
        game.collisionGrid[
          collisionGridPointer({
            x: collisionCellCords.x,
            y: oldCollisionCellCords.y,
          })
        ] = true
      }
    }

    game.collisionGrid[collisionSquareIndex] = true
  }
}