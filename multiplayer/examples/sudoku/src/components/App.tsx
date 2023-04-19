import React, { useEffect } from "react"
import styled from "styled-components/macro"
import { Board } from "./Board"
import { GameState } from "../logic/types/GameState"

export function App() {
  const [game, setGame] = React.useState<GameState | undefined>()

  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame, players, yourPlayerId }) => {
        console.log("visualUpdate", { newGame, players, yourPlayerId })
        setGame(newGame)
      },
    })
  }, [])

  if (!game) return null

  return (
    <Root>
      <Board sudoku={game.sudoku} />
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1e2e44 0%, #423e3d 100%);
`
