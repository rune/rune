import { useAtomValue } from "jotai"
import { $yourPlayer, $currentTurn, $latestGuess } from "../../state/$state"
import {
  turnDuration,
  displayCorrectGuessFor,
  turnAlmostOverAt,
} from "../../logic"
import styled, { css } from "styled-components/macro"
import { LineTimer } from "../Timer/LineTimer"
import { Countdown } from "./Countdown"
import { Acting } from "./Acting/Acting"
import { Guessing } from "./Guessing"
import { Results } from "./Results/Results"
import { useEffect, useRef, useState, memo } from "react"
import { Guess } from "../../lib/types/GameState"
import { EndOfTurn } from "./EndOfTurn"
import { rel } from "../../style/rel"
import { CorrectGuess } from "./CorrectGuess"
import { AlmostOverBackground } from "./AlmostOverBackground"
import { Spectating } from "./Spectating"

export const Game = memo(() => {
  const yourPlayer = useAtomValue($yourPlayer)
  const currentTurn = useAtomValue($currentTurn)
  const latestGuess = useAtomValue($latestGuess)
  const [displayedLatestCorrectGuess, setDisplayedLatestCorrectGuess] =
    useState<Guess>()

  const prevLatestGuessRef = useRef(latestGuess)
  useEffect(() => {
    if (
      JSON.stringify(latestGuess) !== JSON.stringify(prevLatestGuessRef.current)
    ) {
      if (latestGuess?.correct) setDisplayedLatestCorrectGuess(latestGuess)
      prevLatestGuessRef.current = latestGuess
    }
  }, [latestGuess])

  useEffect(() => {
    if (displayedLatestCorrectGuess) {
      const handle = setTimeout(
        () => setDisplayedLatestCorrectGuess(undefined),
        displayCorrectGuessFor * 1000
      )
      return () => clearTimeout(handle)
    }
  }, [displayedLatestCorrectGuess])

  if (!currentTurn) return null

  return (
    <Root actor={yourPlayer?.actor}>
      {currentTurn.stage === "countdown" ? (
        <Countdown />
      ) : currentTurn.stage === "acting" ? (
        <ActingStage>
          <AlmostOverBackground />
          <TimerContainer>
            <LineTimer
              startedAt={currentTurn.timerStartedAt}
              duration={turnDuration}
              actor={!!yourPlayer?.actor}
              almostOverAt={turnAlmostOverAt}
            />
          </TimerContainer>

          {displayedLatestCorrectGuess ? (
            <CorrectGuess {...displayedLatestCorrectGuess} />
          ) : !yourPlayer ? (
            <Spectating />
          ) : yourPlayer.actor ? (
            <Acting />
          ) : (
            <Guessing />
          )}
        </ActingStage>
      ) : currentTurn.stage === "endOfTurn" ? (
        <EndOfTurn />
      ) : currentTurn.stage === "result" ? (
        <Results />
      ) : null}
    </Root>
  )
})

const Root = styled.div<{ actor?: boolean }>`
  animation: fadeIn 300ms ease-out forwards;
  z-index: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${({ actor }) =>
    actor &&
    css`
      background: radial-gradient(
        62.56% 62.56% at 50% 44.09%,
        #bc5287 0%,
        #24083a 81.77%,
        #24083a 100%
      );
    `};
`

const ActingStage = styled.div`
  animation: fadeIn 300ms ease-out forwards;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const TimerContainer = styled.div`
  position: absolute;
  top: ${rel(24)};
  width: 100%;
`
