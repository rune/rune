import { Section } from "../types.ts"
import { turnDegreesPerTick, movePixelsPerTick } from "../logicConfig.ts"
import { degreesToRad } from "../../lib/degreesToRad.ts"

export function updateSectionTail(section: Section) {
  const turningModifier =
    section.turning === "none" ? 0 : section.turning === "right" ? 1 : -1

  section.endAngle += turnDegreesPerTick * turningModifier

  section.end.x += Math.cos(degreesToRad(section.endAngle)) * movePixelsPerTick
  section.end.y += Math.sin(degreesToRad(section.endAngle)) * movePixelsPerTick

  if (section.turning !== "none") {
    section.arc.endAngle = degreesToRad(
      section.endAngle + (-90 + turnDegreesPerTick / 2) * turningModifier,
    )
  }
}
