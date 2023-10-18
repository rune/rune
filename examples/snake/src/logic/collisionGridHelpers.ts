import { Point } from "./types.ts"
import { pixelsPerCollisionGridSquare, boardSize } from "./logicConfig.ts"

export function collisionGridPointer(point: Point): number
export function collisionGridPointer(index: number): Point

export function collisionGridPointer(pointOrIndex: Point | number) {
  if (typeof pointOrIndex === "number") {
    const x = Math.floor(
      pointOrIndex /
        Math.floor(boardSize.height / pixelsPerCollisionGridSquare),
    )
    const y =
      pointOrIndex % Math.floor(boardSize.height / pixelsPerCollisionGridSquare)

    return {
      x: x * pixelsPerCollisionGridSquare,
      y: y * pixelsPerCollisionGridSquare,
    }
  } else {
    return (
      Math.floor(pointOrIndex.x / pixelsPerCollisionGridSquare) *
        Math.floor(boardSize.height / pixelsPerCollisionGridSquare) +
      Math.floor(pointOrIndex.y / pixelsPerCollisionGridSquare)
    )
  }
}
