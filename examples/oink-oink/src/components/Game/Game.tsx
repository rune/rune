import { useAtomValue } from "jotai"
import { $yourPlayer, $currentTurn } from "../../state/$state"
import { turnDuration } from "../../logic"
import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { LineTimer } from "../Timer/LineTimer"
import { Countdown } from "./Countdown"
import { Acting } from "./Acting"
import { Guessing } from "./Guessing"
import { Results } from "./Results"
import { useTimerValue } from "../Timer/useTimerValue"

const almostOverAt = 5

export function Game() {
  const yourPlayer = useAtomValue($yourPlayer)
  const currentTurn = useAtomValue($currentTurn)

  const turnTimerValue =
    useTimerValue({
      startedAt: currentTurn?.timerStartedAt,
      duration: turnDuration,
    }) ?? 0

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
          <LineTimer
            startedAt={currentTurn.timerStartedAt}
            duration={turnDuration}
            actor={!!yourPlayer?.actor}
            almostOverAt={almostOverAt}
          />
          {yourPlayer?.actor ? <Acting /> : <Guessing />}
        </>
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
  padding-top: ${rel(64)};
`
