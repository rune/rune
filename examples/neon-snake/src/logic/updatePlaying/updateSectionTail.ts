import { Section } from "../types.ts"
import {
  turningSpeedDegreesPerTick,
  forwardSpeedPixelsPerTick,
} from "../logicConfig.ts"
import { degreesToRad } from "../../lib/degreesToRad.ts"

export function updateSectionTail(section: Section) {
  const turningModifier =
    section.turning === "none" ? 0 : section.turning === "right" ? 1 : -1

  section.endAngle += turningSpeedDegreesPerTick * turningModifier

  section.end.x +=
    Math.cos(degreesToRad(section.endAngle)) * forwardSpeedPixelsPerTick
  section.end.y +=
    Math.sin(degreesToRad(section.endAngle)) * forwardSpeedPixelsPerTick

  if (section.turning !== "none") {
    section.arc.endAngle = degreesToRad(
      section.endAngle +
        (-90 + turningSpeedDegreesPerTick / 2) * turningModifier,
    )
  }
}
