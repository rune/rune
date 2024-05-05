import { PlayerId } from "dusk-games-sdk/multiplayer"
import { useEffect, useState } from "react"

import selectSoundAudio from "./assets/select.wav"
import { GameState } from "./logic.ts"
import "./styles.css"

const selectSound = new Audio(selectSoundAudio)

function App() {
  const [game, setGame] = useState<GameState>()
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>()

  useEffect(() => {
    Dusk.initClient({
      onChange: ({ game, action, yourPlayerId }) => {
        setGame(game)
        setYourPlayerId(yourPlayerId)

        if (action && action.name === "claimCell") selectSound.play()
      },
    })
  }, [])

  if (!game) {
    return <div>Loading...</div>
  }

  const { winCombo, cells, lastMovePlayerId, playerIds, freeCells } = game

  return (
    <>
      <div id="board" className={!lastMovePlayerId ? "initial" : ""}>
        {cells.map((cell, cellIndex) => {
          const cellValue = cells[cellIndex]

          return (
            <button
              key={cellIndex}
              onClick={() => Dusk.actions.claimCell(cellIndex)}
              data-player={(cellValue !== null
                ? playerIds.indexOf(cellValue)
                : -1
              ).toString()}
              data-dim={String(
                (winCombo && !winCombo.includes(cellIndex)) ||
                  (!freeCells && !winCombo)
              )}
              {...(cells[cellIndex] ||
              lastMovePlayerId === yourPlayerId ||
              winCombo
                ? { "data-disabled": "" }
                : {})}
            />
          )
        })}
      </div>
      <ul id="playersSection">
        {playerIds.map((playerId, index) => {
          const player = Dusk.getPlayerInfo(playerId)

          return (
            <li
              key={playerId}
              data-player={index.toString()}
              data-your-turn={String(
                playerIds[index] !== lastMovePlayerId && !winCombo && freeCells
              )}
            >
              <img src={player.avatarUrl} />
              <span>
                {player.displayName}
                {player.playerId === yourPlayerId && (
                  <span>
                    <br />
                    (You)
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default App
