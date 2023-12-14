import { Section } from "../../logic/types.ts"
import { useCallback } from "react"
import { Graphics as PixiGraphics } from "@pixi/graphics"
import { sectionLineWidth } from "./drawConfig.ts"
import { arcRadius } from "../../logic/updatePlaying/getNextSection.ts"
import { Graphics } from "@pixi/react"

export function DrawSection({
  section,
  color,
  scale,
  isOpponent,
}: {
  section: Section
  color: string
  scale: number
  isOpponent: boolean
}) {
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear()

      g.lineStyle(sectionLineWidth, color, isOpponent ? 0.6 : 1)
      if (section.turning === "none") {
        g.moveTo(section.start.x * scale, section.start.y * scale)
        g.lineTo(section.end.x * scale, section.end.y * scale)
      } else {
        g.arc(
          section.arc.center.x * scale,
          section.arc.center.y * scale,
          arcRadius * scale,
          section.arc.startAngle,
          section.arc.endAngle,
          section.turning === "left",
        )
      }
    },
    [color, isOpponent, scale, section],
  )

  return <Graphics draw={draw} />
}
