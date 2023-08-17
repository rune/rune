import { useAtomValue } from "jotai"
import { $players, $yourPlayer } from "../state/$state"
import { useMemo } from "react"

export function Start() {
  const players = useAtomValue($players)
  const yourPlayer = useAtomValue($yourPlayer)

  const numReady = useMemo(
    () => players?.filter((p) => p.readyToStart).length,
    [players]
  )

  return (
    <button
      onClick={() => Rune.actions.setReadyToStart()}
      disabled={!yourPlayer || yourPlayer?.readyToStart}
    >
      ready ({numReady}/{players?.length})
    </button>
  )
}
