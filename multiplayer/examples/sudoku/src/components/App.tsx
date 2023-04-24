import React, { useEffect } from "react"
import styled from "styled-components/macro"
import { Board } from "./Board/Board"
import { useAtom, useAtomValue } from "jotai"
import { Digits } from "./Digits/Digits"
import { StartGame } from "./StartGame/StartGame"
import { Onboarding } from "./Onboarding"
import { ControlPanel } from "./ControlPanel"
import { $game } from "../state/$game"
import { Hints } from "./Hints/Hints"
import { $onboardingVisible } from "../state/$onboardingVisible"

export function App() {
  const [game, setGame] = useAtom($game)
  const onboardingVisible = useAtomValue($onboardingVisible)

  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame, players, yourPlayerId, rollbacks }) => {
        if (rollbacks.length) {
          // TODO: handle rollback by showing alert
          console.error(JSON.stringify(rollbacks))
        }
        setGame({ game: newGame, players, yourPlayerId })
      },
    })
  }, [setGame])

  if (!game?.game) return null

  return (
    <Root>
      <ControlPanel />
      <Board />
      <Digits />
      {game.game.sudoku ? (
        <>
          <Onboarding />
          {!onboardingVisible && <Hints />}
        </>
      ) : (
        <StartGame />
      )}
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1e2e44 0%, #423e3d 100%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`
