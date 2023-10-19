import { Snake } from "../../logic/types.ts"
import { optimisticSectionIterations } from "./drawConfig.ts"
import { getNextSection } from "../../logic/updatePlaying/getNextSection.ts"
import { updateSectionTail } from "../../logic/updatePlaying/updateSectionTail.ts"

export function getOptimisticStartSection(snake: Snake) {
  const latestSection = snake.sections[snake.sections.length - 1]
  const optimisticSection = getNextSection(latestSection, snake.turning, false)

  for (let i = 0; i < optimisticSectionIterations; i++) {
    updateSectionTail(optimisticSection)
  }

  return optimisticSection
}
