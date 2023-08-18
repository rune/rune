import { useAtomValue } from "jotai"
import { $players } from "../../state/$state"

export function Results() {
  const players = useAtomValue($players)

  return (
    <div>
      <h1>Results</h1>
      <div>
        {players.map((player) => (
          <div key={player.id}>
            {player.info.displayName}: {player.score} (+{player.latestScore})
          </div>
        ))}
      </div>
      <button onClick={() => Rune.actions.nextRound()}>continue</button>
    </div>
  )
}
