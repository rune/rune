import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"
import { Board } from "./Board/Board"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Digits } from "./Digits/Digits"
import { StartGame } from "./StartGame/StartGame"
import { Onboarding } from "./Onboarding"
import { ControlPanel } from "./ControlPanel/ControlPanel"
import { $game } from "../state/$game"
import { Hints } from "./Hints/Hints"
import { $onboardingVisible } from "../state/$onboardingVisible"
import { totalBlipsDuration } from "./Board/useSuccessBlip"
import { PlayerLabels } from "./PlayerLabels/PlayerLabels"
import { $lastPlayerActivity } from "../state/$lastPlayerActivity"

export function App() {
  const [game, setGame] = useAtom($game)
  const onboardingVisible = useAtomValue($onboardingVisible)
  const [gen, setGen] = useState(0)
  const setLastPlayerActivity = useSetAtom($lastPlayerActivity)

  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({
        newGame,
        players,
        yourPlayerId,
        rollbacks,
        action,
        event,
      }) => {
        const lastActivityPlayerId =
          action?.action === "setValue" ||
          action?.action === "select" ||
          action?.action === "toggleNote"
            ? action.playerId
            : event?.event === "playerJoined" && event.params.playerId

        if (lastActivityPlayerId) {
          setLastPlayerActivity((prev) => ({
            ...prev,
            [lastActivityPlayerId]: new Date(),
          }))
        }

        if (rollbacks.length) {
          // TODO: handle rollback by showing alert
          console.error(JSON.stringify(rollbacks))
        }
        setGame({ game: newGame, players, yourPlayerId })
      },
    })
  }, [setGame, setLastPlayerActivity])

  useEffect(() => {
    if (game?.game.gameOver) {
      const handle = setTimeout(
        () => Rune.showGameOverPopUp(),
        totalBlipsDuration + 2000
      )
      return () => clearTimeout(handle)
    } else {
      setGen((gen) => gen + 1)
    }
  }, [game?.game.gameOver])

  if (!game?.game) return null

  return (
    <Root key={gen}>
      <ControlPanel />
      <Board />
      <Digits />
      {game.game.sudoku ? (
        <>
          <Onboarding />
          {!onboardingVisible && (
            <>
              <PlayerLabels />
              <Hints />
            </>
          )}
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
