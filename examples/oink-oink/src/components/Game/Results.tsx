import { useAtomValue } from "jotai"
import { $players } from "../../state/$state"

export function Results() {
  const players = useAtomValue($players)

  // TODO: show game over when animation ends

  return (
    <div>
      <h1>Results</h1>
      <div>
        {players.map((player) => (
          <div key={player.id}>
            {player.info.displayName}: {player.score} (+
            {player.latestRoundScore})
          </div>
        ))}
      </div>
      <button onClick={() => Rune.actions.nextRound()}>continue</button>
    </div>
  )
}
