import { LabelDefinition, Direction } from "./types"
import { corners } from "./corners"

export function getCornerPositionAndDirection(
  label: LabelDefinition,
  corner: (typeof corners)[number]
): {
  corner: { x: number; y: number }
  direction: Direction
} {
  if (corner === "top-left") {
    return {
      corner: {
        x: label.cellRect.x,
        y: label.cellRect.y,
      },
      direction: "left",
    }
  } else if (corner === "top-right") {
    return {
      corner: {
        x: label.cellRect.x + label.cellRect.width,
        y: label.cellRect.y,
      },
      direction: "right",
    }
  } else if (corner === "bottom-left") {
    return {
      corner: {
        x: label.cellRect.x,
        y: label.cellRect.y + label.cellRect.height,
      },
      direction: "left",
    }
  } else {
    return {
      corner: {
        x: label.cellRect.x + label.cellRect.width,
        y: label.cellRect.y + label.cellRect.height,
      },
      direction: "right",
    }
  }
}
