import { Point, PlayerInfo, GameState } from "../types.ts"
import {
  collisionToGlobalPoint,
  globalToCollisionPoint,
} from "../collisionGridHelpers.ts"
import { isLatestSectionOutOfBounds } from "../isLatestSectionOutOfBounds.ts"
import { checkWinnersAndGameOver } from "../checkWinnersAndGameOver.ts"

function markCollisionGrid(game: GameState, collisionPoint: Point) {
  //Initialize collision grid if it does not exist yet

  if (!game.collisionGrid[collisionPoint.x]) {
    game.collisionGrid[collisionPoint.x] = {}
  }

  game.collisionGrid[collisionPoint.x][collisionPoint.y] = true
}

export function checkLatestSectionForCollisions(
  previousEnd: Point,
  player: PlayerInfo,
  game: GameState,
) {
  const snake = game.snakes[player.playerId]
  const latestSection = snake.sections[snake.sections.length - 1]

  const prevCollisionPoint = globalToCollisionPoint(previousEnd)
  const currentCollisionPoint = globalToCollisionPoint(latestSection.end)

  if (
    isLatestSectionOutOfBounds(snake) ||
    ((currentCollisionPoint.x !== prevCollisionPoint.x ||
      currentCollisionPoint.y !== prevCollisionPoint.y) &&
      game.collisionGrid[currentCollisionPoint.x]?.[currentCollisionPoint.y])
  ) {
    player.state = "dead"
    player.diedAt = Rune.gameTime()
    checkWinnersAndGameOver(game)
  } else if (!latestSection.gap) {
    const prevGlobalPoint = collisionToGlobalPoint(prevCollisionPoint)
    const currentGlobalPoint = collisionToGlobalPoint(currentCollisionPoint)

    if (
      prevGlobalPoint.x !== currentGlobalPoint.x &&
      prevGlobalPoint.y !== currentGlobalPoint.y
    ) {
      const point =
        currentGlobalPoint.x > prevGlobalPoint.y &&
        currentGlobalPoint.y > prevGlobalPoint.y
          ? {
              ...currentGlobalPoint,
            }
          : currentGlobalPoint.x < prevGlobalPoint.y &&
            currentGlobalPoint.y < prevGlobalPoint.y
          ? {
              ...prevGlobalPoint,
            }
          : currentGlobalPoint.x > prevGlobalPoint.y &&
            currentGlobalPoint.y < prevGlobalPoint.y
          ? {
              x: currentGlobalPoint.x,
              y: prevGlobalPoint.y,
            }
          : {
              x: prevGlobalPoint.x,
              y: currentGlobalPoint.y,
            }

      const latestSectionLineEquation = {
        a:
          (latestSection.end.y - previousEnd.y) /
          (latestSection.end.x - previousEnd.x),
        b:
          latestSection.end.y -
          (latestSection.end.x * (latestSection.end.y - previousEnd.y)) /
            (latestSection.end.x - previousEnd.x),
      }

      const pointAboveLine =
        point.y >
        latestSectionLineEquation.a * point.x + latestSectionLineEquation.b

      const latestSectionGoingDown = latestSection.end.y > previousEnd.y
      const latestSectionGoingRight = latestSection.end.x > previousEnd.x

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
        markCollisionGrid(
          game,
          globalToCollisionPoint({
            x: prevGlobalPoint.x,
            y: currentGlobalPoint.y,
          }),
        )
      } else {
        markCollisionGrid(
          game,
          globalToCollisionPoint({
            x: currentGlobalPoint.x,
            y: prevGlobalPoint.y,
          }),
        )
      }
    }

    markCollisionGrid(game, currentCollisionPoint)
  }
}
