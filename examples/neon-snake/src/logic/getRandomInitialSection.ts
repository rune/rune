import { Section, Point } from "./types.ts"
import { boardSize, movePixelsPerTick } from "./logicConfig.ts"
import { getRandomIntBetween } from "../lib/getRandomIntBetween.ts"

const boardCenterX = boardSize.width / 2
const boardCenterY = boardSize.height / 2
const boardSafeMargin = movePixelsPerTick * 10

export function getRandomInitialSection(): Section {
  const startPoint = {
    x: getRandomIntBetween(boardSafeMargin, boardSize.width - boardSafeMargin),
    y: getRandomIntBetween(boardSafeMargin, boardSize.height - boardSafeMargin),
  }

  const angle = getRandomIntBetween(...getAngleLimits(startPoint))

  return {
    start: startPoint,
    end: startPoint,
    turning: "none",
    endAngle: angle,
    gap: false,
  }
}

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
