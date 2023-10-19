import { Section } from "../types.ts"
import { turningDegreesPerTick, forwardPixelsPerTick } from "../logicConfig.ts"
import { degreesToRad } from "../../lib/degreesToRad.ts"

export function updateSectionTail(section: Section) {
  const turningModifier =
    section.turning === "none" ? 0 : section.turning === "right" ? 1 : -1

  section.endAngle += turningDegreesPerTick * turningModifier

  section.end.x +=
    Math.cos(degreesToRad(section.endAngle)) * forwardPixelsPerTick
  section.end.y +=
    Math.sin(degreesToRad(section.endAngle)) * forwardPixelsPerTick

  if (section.turning !== "none") {
    section.arc.endAngle = degreesToRad(
      section.endAngle + (-90 + turningDegreesPerTick / 2) * turningModifier,
    )
  }
}
