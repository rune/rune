import { useAtomValue } from "jotai"
import { $actorPlayer } from "../../state/$state"

export function EndOfTurn() {
  const actorPlayer = useAtomValue($actorPlayer)

  return (
    <div>
      {actorPlayer?.info.displayName} (+{actorPlayer?.latestTurnScore} for
      acting)
    </div>
  )
}
