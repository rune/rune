import { PlayerId } from "rune-games-sdk"
import { getRandomInt, getRandomIntBetween } from "../lib/helpers.ts"
import { boardSize } from "./logic.ts"
import { Point, PlayerInfo } from "./types.ts"

export function getNewPlayer(playerId: PlayerId, color: string): PlayerInfo {
  const startPoint = {
    // TODO: center of each quadrant instead of random? or just far enough away from each other?
    x: getRandomInt(boardSize.width),
    y: getRandomInt(boardSize.height),
  }

  const boardCenterX = boardSize.width / 2
  const boardCenterY = boardSize.height / 2

  function getAngleLimits(startPoint: Point): [number, number] {
    return startPoint.x < boardCenterX && startPoint.y < boardCenterY
      ? [0, 90]
      : startPoint.x > boardCenterX && startPoint.y < boardCenterY
      ? [90, 180]
      : startPoint.x < boardCenterX && startPoint.y > boardCenterY
      ? [270, 360]
      : startPoint.x > boardCenterX && startPoint.y > boardCenterY
      ? [180, 270]
      : [0, 360]
  }

  const angle = getRandomIntBetween(...getAngleLimits(startPoint))

  return {
    playerId,
    turning: "none",
    gapCounter: 0,
    color,
    state: "alive",
    line: [
      {
        start: startPoint,
        end: startPoint,
        turning: "none",
        endAngle: angle,
        gap: false,
      },
    ],
  }
}
