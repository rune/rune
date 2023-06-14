import { Coordinate } from "./types/GameState"

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function calculateBoardRect(
  boardRef: HTMLDivElement,
  from: Coordinate,
  to: Coordinate
): Rect {
  const [topLeft, bottomRight] = [
    `cell-${from.row}-${from.col}`,
    `cell-${to.row}-${to.col}`,
  ].map((pointer) =>
    boardRef
      .querySelector(`[data-pointer="${pointer}"]`)
      ?.getBoundingClientRect()
  )

  if (!topLeft || !bottomRight) throw new Error("Could not find cell bounds.")

  return {
    x: topLeft.left,
    y: topLeft.top,
    width: bottomRight.right - topLeft.left,
    height: bottomRight.bottom - topLeft.top,
  }
}
