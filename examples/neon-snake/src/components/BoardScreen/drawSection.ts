import { Section } from "../../logic/types.ts"
import { shadowBlur, sectionLineWidth } from "./drawConfig.ts"
import { arcRadius } from "../../logic/updatePlaying/getNextSection.ts"

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
      section.arc.center.x * scale,
      section.arc.center.y * scale,
      arcRadius * scale,
      section.arc.startAngle,
      section.arc.endAngle,
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
