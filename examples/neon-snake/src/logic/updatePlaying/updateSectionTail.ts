import { Section } from "../types.ts"
import { turnDegreesPerTick, movePixelsPerTick } from "../logicConfig.ts"
import { degreesToRad } from "../../lib/degreesToRad.ts"

export function updateSectionTail(section: Section) {
  if (section.turning !== "none") {
    const turningModifier = section.turning === "right" ? 1 : -1
    section.endAngle += turnDegreesPerTick * turningModifier
  }

  section.end.x += Math.cos(degreesToRad(section.endAngle)) * movePixelsPerTick
  section.end.y += Math.sin(degreesToRad(section.endAngle)) * movePixelsPerTick
}
