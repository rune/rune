import { Point } from "./types.ts"
import { movePixelsPerTick } from "./logicConfig.ts"

// Use coarse collision grid for performance optimization
export const collisionGridSize = Math.round(movePixelsPerTick * 3)

export function globalToCollisionPoint(globalPoint: Point) {
  return {
    x: Math.floor(globalPoint.x / collisionGridSize),
    y: Math.floor(globalPoint.y / collisionGridSize),
  }
}

export function collisionToGlobalPoint(collisionPoint: Point) {
  return {
    x: collisionPoint.x * collisionGridSize,
    y: collisionPoint.y * collisionGridSize,
  }
}
