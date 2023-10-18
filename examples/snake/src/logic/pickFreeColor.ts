import { GameState } from "./types.ts"
import { colors } from "./logicConfig.ts"

export function pickFreeColor(game: GameState) {
  const usedColors = game.players.map((p) => p.color)
  const color = colors.find((color) => !usedColors.includes(color))

  if (!color) throw Rune.invalidAction()

  return color
}
