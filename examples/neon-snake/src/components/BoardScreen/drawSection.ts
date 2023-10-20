import { Section } from "../../logic/types.ts"
import { shadowBlur, sectionLineWidth } from "./drawConfig.ts"
import { arcRadius } from "../../logic/updatePlaying/getNextSection.ts"
import { degreesToRad } from "../../lib/degreesToRad"
import { turnDegreesPerTick } from "../../logic/logicConfig"

export function drawSection(
  ctx: CanvasRenderingContext2D,
  scale: number,
  section: Section,
  color: string
) {
  ctx.beginPath()

  if (section.turning === "none") {
    ctx.moveTo(section.start.x * scale, section.start.y * scale)
    ctx.lineTo(section.end.x * scale, section.end.y * scale)
  } else {
    const centerX =
      section.start.x +
      Math.cos(degreesToRad(section.arc.angleToCenter)) * arcRadius
    const centerY =
      section.start.y +
      Math.sin(degreesToRad(section.arc.angleToCenter)) * arcRadius

    const turningModifier = section.turning === "right" ? 1 : -1
    const arcEndAngle = degreesToRad(section.endAngle - 90 * turningModifier)

    ctx.arc(
      centerX * scale,
      centerY * scale,
      arcRadius * scale,
      section.arc.startAngle,
      arcEndAngle,
      section.turning === "left"
    )
  }

  ctx.lineWidth = sectionLineWidth * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = shadowBlur * window.devicePixelRatio
  ctx.shadowColor = color

  ctx.stroke()
  ctx.stroke()
}
