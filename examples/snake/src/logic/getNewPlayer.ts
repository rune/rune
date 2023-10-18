import { PlayerId } from "rune-games-sdk"
import { PlayerInfo, State } from "./types.ts"

export function getNewPlayer({
  playerId,
  state,
  color,
}: {
  playerId: PlayerId
  state: State
  color: string
}): PlayerInfo {
  return {
    playerId,
    turning: "none",
    gapCounter: 0,
    color,
    state,
    line: [],
    score: 0,
  }
}
