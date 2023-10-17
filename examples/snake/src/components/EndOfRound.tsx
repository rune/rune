import { useAtomValue } from "jotai"
import { $lastRoundWinnerId, $players, $yourPlayerId } from "../state/state.ts"

export function EndOfRound() {
  const lastRoundWinnerId = useAtomValue($lastRoundWinnerId)
  const players = useAtomValue($players)
  const yourPlayerId = useAtomValue($yourPlayerId)

  const winner = lastRoundWinnerId ? players[lastRoundWinnerId] : null

  if (!winner) return null

  return (
    <div
      style={{ position: "absolute", color: "white", left: "50%", top: "50%" }}
    >
      End of Round. Winner is{" "}
      {winner.playerId === yourPlayerId ? "You" : winner.displayName}
    </div>
  )
}
