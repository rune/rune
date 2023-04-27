import React, { useEffect } from "react"
import styled from "styled-components/macro"
import { Board } from "./Board/Board"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Digits } from "./Digits/Digits"
import { StartGame } from "./StartGame/StartGame"
import { Onboarding } from "./Onboarding/Onboarding"
import { ControlPanel } from "./ControlPanel/ControlPanel"
import { $game, $session } from "../state/$game"
import { Hints } from "./Hints/Hints"
import { $onboardingVisible } from "../state/$onboardingVisible"
import { totalBlipsDuration } from "./Board/useSuccessBlip"
import { PlayerLabels } from "./PlayerLabels/PlayerLabels"
import { $lastPlayerActivity } from "../state/$lastPlayerActivity"
import { $lastSetValueRollback } from "../state/$lastSetValueRollback"
import { $inputMode } from "../state/$inputMode"
import { $animatingHints } from "../state/$animatingHints"
import { sounds } from "../sounds/sounds"

export function App() {
  const [game, setGame] = useAtom($game)
  const onboardingVisible = useAtomValue($onboardingVisible)
  const session = useAtomValue($session)
  const setLastPlayerActivity = useSetAtom($lastPlayerActivity)
  const setLastSetValueRollback = useSetAtom($lastSetValueRollback)
  const setInputMode = useSetAtom($inputMode)
  const setAnimatingHints = useSetAtom($animatingHints)

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
        setGame({ game: newGame, players, yourPlayerId })

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

        if (rollbacks.some((r) => r.action === "setValue")) {
          setLastSetValueRollback(new Date())
        }

        if (action?.action === "setValue") {
          if ((action.params as any).value) {
            if (newGame.sudoku?.board.filter((c) => c.error).length) {
              sounds.error.play()
            } else {
              sounds.setValue.play()
            }
          } else {
            sounds.backspace.play()
          }
        } else if (action?.action === "toggleNote") {
          if ((action.params as any).value) sounds.note.play()
          else sounds.backspace.play()
        } else if (action?.action === "startGame") {
          sounds.setDifficulty.play()
        }
      },
    })
  }, [setGame, setLastPlayerActivity, setLastSetValueRollback])

  useEffect(() => {
    if (game?.game.gameOver) {
      const handle = setTimeout(
        () => Rune.showGameOverPopUp(),
        totalBlipsDuration + 2000
      )
      return () => clearTimeout(handle)
    }
  }, [game?.game.gameOver])

  useEffect(() => {
    if (!session) return

    setLastPlayerActivity({})
    setLastSetValueRollback(null)
    setInputMode("value")
    setAnimatingHints({})
  }, [
    session,
    setAnimatingHints,
    setInputMode,
    setLastPlayerActivity,
    setLastSetValueRollback,
  ])

  if (!game?.game) return null

  return (
    <Root key={session}>
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
