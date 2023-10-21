import { Section, Turning } from "../types.ts"
import { turnDegreesPerTick, movePixelsPerTick } from "../logicConfig.ts"
import { degreesToRad } from "../../lib/degreesToRad.ts"

export const arcRadius =
  (180 * movePixelsPerTick) / (Math.PI * turnDegreesPerTick)

export function getNextSection(
  previousSection: Section,
  turning: Turning,
  isPlacingGap: boolean,
): Section {
  if (turning === "none") {
    return {
      start: { ...previousSection.end },
      end: { ...previousSection.end },
      endAngle: previousSection.endAngle,
      gap: isPlacingGap,
      turning: "none",
    }
  } else {
    const turningModifier = turning === "right" ? 1 : -1

    const angleToCenter =
      previousSection.endAngle +
      (+90 + turnDegreesPerTick / 2) * turningModifier

    const startAngle = degreesToRad(
      previousSection.endAngle +
        (-90 + turnDegreesPerTick / 2) * turningModifier,
    )

    return {
      start: { ...previousSection.end },
      end: { ...previousSection.end },
      endAngle: previousSection.endAngle,
      gap: isPlacingGap,
      turning,
      arc: {
        center: {
          x:
            previousSection.end.x +
            Math.cos(degreesToRad(angleToCenter)) * arcRadius,
          y:
            previousSection.end.y +
            Math.sin(degreesToRad(angleToCenter)) * arcRadius,
        },
        startAngle: startAngle,
        endAngle: startAngle,
      },
    }
  }
}
