import { PlayerId } from "rune-games-sdk"
import { PlayerInfo, State } from "./types.ts"
import { getInitialLine } from "./getInitialLine.ts"

export function getNewPlayer(
  playerId: PlayerId,
  state: State,
  color: string,
): PlayerInfo {
  return {
    playerId,
    turning: "none",
    gapCounter: 0,
    color,
    state,
    line: getInitialLine(),
    score: 0,
  }
}
