import { Section } from "../../logic/types.ts"
import { arcRadius } from "../../logic/logic.ts"
import { shadowBlur, sectionLineWidth } from "./drawConfig.ts"

export function drawSection(
  ctx: CanvasRenderingContext2D,
  scale: number,
  section: Section,
  color: string,
) {
  ctx.beginPath()

  if (section.turning === "none") {
    ctx.moveTo(section.start.x * scale, section.start.y * scale)
    ctx.lineTo(section.end.x * scale, section.end.y * scale)
  } else {
    ctx.arc(
      section.arcCenter.x * scale,
      section.arcCenter.y * scale,
      arcRadius * scale,
      section.arcStartAngle,
      section.arcEndAngle,
      section.turning === "left",
    )
  }

  ctx.lineWidth = sectionLineWidth * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = shadowBlur * window.devicePixelRatio
  ctx.shadowColor = color

  ctx.stroke()
  ctx.stroke()
}
