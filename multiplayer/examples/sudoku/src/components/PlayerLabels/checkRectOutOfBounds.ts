import { Rect } from "./types"

export function checkRectOutOfBounds(rect: Rect) {
  return (
    rect.x < 0 ||
    rect.y < 0 ||
    rect.x + rect.width > window.innerWidth ||
    rect.y + rect.height > window.innerHeight
  )
}
