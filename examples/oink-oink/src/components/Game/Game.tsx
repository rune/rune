import { useAtomValue } from "jotai"
import { $yourPlayer, $round } from "../../state/$state"
import { numRounds } from "../../logic"

export function Game() {
  const yourPlayer = useAtomValue($yourPlayer)
  const round = useAtomValue($round)

  return (
    <div>
      <div>
        round {round + 1}/{numRounds}
      </div>
      <pre>{JSON.stringify(yourPlayer, null, 2)}</pre>
    </div>
  )
}
