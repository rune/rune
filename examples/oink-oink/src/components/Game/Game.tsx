import { useAtomValue } from "jotai"
import {
  $yourPlayer,
  $round,
  $actorPlayer,
  $currentTurn,
} from "../../state/$state"
import { numRounds, turnCountdown, turnDuration } from "../../logic"
import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { PieTimer } from "../Timer/PieTimer"
import { LineTimer } from "../Timer/LineTimer"

export function Game() {
  const yourPlayer = useAtomValue($yourPlayer)
  const actorPlayer = useAtomValue($actorPlayer)
  const round = useAtomValue($round)
  const currentTurn = useAtomValue($currentTurn)

  if (!currentTurn) return null

  return (
    <Root actor={yourPlayer?.actor}>
      {currentTurn.stage === "countdown" ? (
        <>
          <RoundLabel>
            Round
            <br />
            {round + 1}/{numRounds}
          </RoundLabel>
          <UpNext>
            {yourPlayer?.actor ? (
              <UpNextLabel>You’re up next!</UpNextLabel>
            ) : (
              <>
                <Avatar src={actorPlayer?.info.avatarUrl} />
                <UpNextLabel>
                  {actorPlayer?.info.displayName}
                  <br />
                  is up next!
                </UpNextLabel>
              </>
            )}
          </UpNext>
          <PieTimer
            startedAt={currentTurn.countdownStartedAt}
            duration={turnCountdown}
          />
        </>
      ) : currentTurn.stage === "acting" ? (
        <>
          <LineTimer
            startedAt={currentTurn.timerStartedAt}
            duration={turnDuration}
            almostOverAt={5}
          />
        </>
      ) : currentTurn.stage === "result" ? (
        <div>results</div>
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

const RoundLabel = styled.div`
  font-size: ${rel(64)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  text-align: center;
`

const UpNext = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > :not(:first-child) {
    margin-top: ${rel(12)};
  }
  margin: ${rel(24)} 0;
`

const UpNextLabel = styled.div`
  font-size: ${rel(28)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
  text-align: center;
`

const Avatar = styled.img`
  width: ${rel(94)};
  height: ${rel(94)};
`
