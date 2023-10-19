import { Point } from "./types.ts"
import { boardSize, forwardPixelsPerTick } from "./logicConfig.ts"

const collisionGridSize = Math.round(forwardPixelsPerTick * 1.5)

export function collisionGridPointer(point: Point): number
export function collisionGridPointer(index: number): Point

export function collisionGridPointer(pointOrIndex: Point | number) {
  if (typeof pointOrIndex === "number") {
    const x = Math.floor(
      pointOrIndex / Math.floor(boardSize.height / collisionGridSize),
    )
    const y = pointOrIndex % Math.floor(boardSize.height / collisionGridSize)

    return {
      x: x * collisionGridSize,
      y: y * collisionGridSize,
    }
  } else {
    return (
      Math.floor(pointOrIndex.x / collisionGridSize) *
        Math.floor(boardSize.height / collisionGridSize) +
      Math.floor(pointOrIndex.y / collisionGridSize)
    )
  }
}
