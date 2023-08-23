import { useAtomValue } from "jotai"
import { $yourPlayer, $currentTurn, $latestGuess } from "../../state/$state"
import { turnDuration, displayCorrectGuessFor } from "../../logic"
import styled, { css } from "styled-components/macro"
import { LineTimer } from "../Timer/LineTimer"
import { Countdown } from "./Countdown"
import { Acting } from "./Acting"
import { Guessing } from "./Guessing"
import { Results } from "./Results/Results"
import { useTimerValue } from "../Timer/useTimerValue"
import { useEffect, useRef, useState } from "react"
import { Guess } from "../../lib/types/GameState"
import { EndOfTurn } from "./EndOfTurn"
import { rel } from "../../style/rel"
import { CorrectGuess } from "./CorrectGuess"

const almostOverAt = 5

export function Game() {
  const yourPlayer = useAtomValue($yourPlayer)
  const currentTurn = useAtomValue($currentTurn)
  const latestGuess = useAtomValue($latestGuess)
  const [displayedLatestCorrectGuess, setDisplayedLatestCorrectGuess] =
    useState<Guess>()

  // TODO: this doesn't reset when the turn changes so it stays red if it was almost over before
  //  perhaps do it as a AlmostOverBackground component so we can unmount it between stages?
  const turnTimerValue =
    useTimerValue({
      startedAt: currentTurn?.timerStartedAt,
      duration: turnDuration,
    }) ?? 0

  const prevLatestGuessRef = useRef(latestGuess)
  useEffect(() => {
    if (latestGuess !== prevLatestGuessRef.current) {
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
    <Root
      actor={yourPlayer?.actor}
      almostOver={
        currentTurn.stage === "acting" && turnTimerValue <= almostOverAt
      }
    >
      {currentTurn.stage === "countdown" ? (
        <Countdown />
      ) : currentTurn.stage === "acting" ? (
        <>
          <TimerContainer>
            <LineTimer
              startedAt={currentTurn.timerStartedAt}
              duration={turnDuration}
              actor={!!yourPlayer?.actor}
              almostOverAt={almostOverAt}
            />
          </TimerContainer>

          {displayedLatestCorrectGuess ? (
            <CorrectGuess {...displayedLatestCorrectGuess} />
          ) : yourPlayer?.actor ? (
            <Acting />
          ) : (
            <Guessing />
          )}
        </>
      ) : currentTurn.stage === "endOfTurn" ? (
        <EndOfTurn />
      ) : currentTurn.stage === "result" ? (
        <Results />
      ) : null}
    </Root>
  )
}

const Root = styled.div<{ actor?: boolean; almostOver?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${({ actor, almostOver }) =>
    almostOver
      ? css`
          background: radial-gradient(
            62.56% 62.56% at 50% 44.09%,
            #ff5631 0%,
            #57112b 81.77%,
            #310414 100%
          );
        `
      : actor &&
        css`
          background: radial-gradient(
            62.56% 62.56% at 50% 44.09%,
            #bc5287 0%,
            #24083a 81.77%,
            #24083a 100%
          );
        `};
`

const TimerContainer = styled.div`
  position: absolute;
  top: ${rel(24)};
  width: 100%;
`
