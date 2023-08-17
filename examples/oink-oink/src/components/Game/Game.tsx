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

export function Game() {
  const yourPlayer = useAtomValue($yourPlayer)
  const currentTurn = useAtomValue($currentTurn)

  if (!currentTurn) return null

  return (
    <Root actor={yourPlayer?.actor}>
      {currentTurn.stage === "countdown" ? (
        <Countdown />
      ) : currentTurn.stage === "acting" ? (
        <>
          <LineTimer
            startedAt={currentTurn.timerStartedAt}
            duration={turnDuration}
            actor={!!yourPlayer?.actor}
            almostOverAt={5}
          />
          {yourPlayer?.actor ? <Acting /> : <Guessing />}
        </>
      ) : currentTurn.stage === "result" ? (
        <Results />
      ) : null}
    </Root>
  )
}

const Root = styled.div<{ actor?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  padding-top: ${rel(64)};
`
