import { PlayerInfo } from "./types.ts"
import { colors } from "./logicConfig.ts"

export function pickFreeColor(playerInfos: PlayerInfo[]) {
  const usedColors = playerInfos.map((p) => p.color)
  const color = colors.find((color) => !usedColors.includes(color))

  if (!color) throw Dusk.invalidAction()

  return color
}
