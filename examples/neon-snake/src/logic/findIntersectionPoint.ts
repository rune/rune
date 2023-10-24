import { Point } from "./types.ts"

export function findIntersectionPoint(
  line1: { start: Point; end: Point },
  line2: { start: Point; end: Point }
): Point | null {
  const { start: line1Start, end: line1End } = line1
  const { start: line2Start, end: line2End } = line2

  const a1 = line1End.y - line1Start.y
  const b1 = line1Start.x - line1End.x
  const c1 = a1 * line1Start.x + b1 * line1Start.y

  const a2 = line2End.y - line2Start.y
  const b2 = line2Start.x - line2End.x
  const c2 = a2 * line2Start.x + b2 * line2Start.y

  const determinant = a1 * b2 - a2 * b1

  // lines are not parallel
  if (determinant !== 0) {
    const x = (b2 * c1 - b1 * c2) / determinant
    const y = (a1 * c2 - a2 * c1) / determinant

    if (
      Math.min(line1Start.x, line1End.x) <= x &&
      x <= Math.max(line1Start.x, line1End.x) &&
      Math.min(line1Start.y, line1End.y) <= y &&
      y <= Math.max(line1Start.y, line1End.y) &&
      Math.min(line2Start.x, line2End.x) <= x &&
      x <= Math.max(line2Start.x, line2End.x) &&
      Math.min(line2Start.y, line2End.y) <= y &&
      y <= Math.max(line2Start.y, line2End.y)
    ) {
      return { x, y }
    }
  }

  return null
}
