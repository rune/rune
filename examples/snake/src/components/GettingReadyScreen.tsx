import { useAtomValue } from "jotai"
import { $readyPlayerIds, $yourPlayerId } from "../state/state.ts"

export function GettingReadyScreen() {
  const readyPlayerIds = useAtomValue($readyPlayerIds)
  const yourPlayerId = useAtomValue($yourPlayerId)

  return (
    <div
      style={{ color: "white", position: "absolute", left: "50%", top: "50%" }}
    >
      <div>{readyPlayerIds.length} players ready</div>
      <button
        onClick={() => Rune.actions.setReady()}
        disabled={!yourPlayerId || readyPlayerIds.includes(yourPlayerId)}
      >
        ready
      </button>
    </div>
  )
}