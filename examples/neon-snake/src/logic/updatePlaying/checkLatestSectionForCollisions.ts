import { Point, PlayerInfo, GameState, CollisionGrid, Snake } from "../types.ts"
import {
  collisionToGlobalPoint,
  globalToCollisionPoint,
} from "../collisionGridHelpers.ts"
import { isLatestSectionOutOfBounds } from "../isLatestSectionOutOfBounds.ts"
import { checkWinnersAndGameOver } from "../checkWinnersAndGameOver.ts"
import { allowedCollisionPoints } from "../logicConfig.ts"

function markCollisionGrid(
  collisionGrid: CollisionGrid,
  collisionPoint: Point,
  snake: Snake,
) {
  //Initialize collision grid if it does not exist yet

  if (!collisionGrid[collisionPoint.x]) {
    collisionGrid[collisionPoint.x] = {}
  }

  collisionGrid[collisionPoint.x][collisionPoint.y] = true

  //Check to make sure we don't push same value in multiple times
  if (!isCollisionPointRecentlyVisitedBySnake(snake, collisionPoint)) {
    //Save where the snake was recently at.
    snake.lastCollisionGridPoints = [
      collisionPoint,
      ...snake.lastCollisionGridPoints.slice(0, allowedCollisionPoints - 1),
    ]
  }
}

// With current angle calculation, it is possible to visit a cell that was just marked by the same snake.
// To avoid self collisions, we ignore the collision if the cell is recently visited.
function isCollisionPointRecentlyVisitedBySnake(
  snake: Snake,
  currentCollisionPoint: Point,
) {
  return snake.lastCollisionGridPoints.some(
    (recentPoint) =>
      recentPoint.x === currentCollisionPoint.x &&
      recentPoint.y === currentCollisionPoint.y,
  )
}

export function checkLatestSectionForCollisions(
  previousEnd: Point,
  player: PlayerInfo,
  game: GameState,
) {
  const snake = game.snakes[player.playerId]
  const latestSection = snake.sections[snake.sections.length - 1]
  const { collisionGrid } = game

  const prevCollisionPoint = globalToCollisionPoint(previousEnd)
  const currentCollisionPoint = globalToCollisionPoint(latestSection.end)

  const isSameCollisionPointAsBefore =
    currentCollisionPoint.x === prevCollisionPoint.x &&
    currentCollisionPoint.y === prevCollisionPoint.y

  if (
    //If snake is out of bounds or
    isLatestSectionOutOfBounds(snake) ||
    //Snake has moved from previous position
    (!isSameCollisionPointAsBefore &&
      //Snake is in already marked collision grid point
      collisionGrid[currentCollisionPoint.x]?.[currentCollisionPoint.y] &&
      //This point was not recently visited by this snake
      !isCollisionPointRecentlyVisitedBySnake(snake, currentCollisionPoint))
  ) {
    player.state = "dead"
    player.diedAt = Rune.gameTime()
    checkWinnersAndGameOver(game)
  } else if (!latestSection.gap) {
    const prevGlobalPoint = collisionToGlobalPoint(prevCollisionPoint)
    const currentGlobalPoint = collisionToGlobalPoint(currentCollisionPoint)

    //Diagonal line check
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
          collisionGrid,
          globalToCollisionPoint({
            x: prevGlobalPoint.x,
            y: currentGlobalPoint.y,
          }),
          snake,
        )
      } else {
        markCollisionGrid(
          collisionGrid,
          globalToCollisionPoint({
            x: currentGlobalPoint.x,
            y: prevGlobalPoint.y,
          }),
          snake,
        )
      }
    }

    markCollisionGrid(collisionGrid, currentCollisionPoint, snake)
  }
}
