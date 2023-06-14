import { LabelDefinition, Rect } from "./types"
import { getCornerPositionAndDirection } from "./getCornerPositionAndDirection"

export function getEstimatedRect(
  label: LabelDefinition,
  { corner, direction }: ReturnType<typeof getCornerPositionAndDirection>
): Rect {
  return direction === "left"
    ? {
        x: corner.x - label.width,
        y: corner.y - label.height / 2,
        width: label.width,
        height: label.height,
      }
    : {
        x: corner.x,
        y: corner.y - label.height / 2,
        width: label.width,
        height: label.height,
      }
}
