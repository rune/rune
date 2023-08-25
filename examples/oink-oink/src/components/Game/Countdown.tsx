import { numRounds, turnCountdown } from "../../logic"
import { PieTimer } from "../Timer/PieTimer"
import styled from "styled-components/macro"
import { rel } from "../../style/rel"
import { useAtomValue } from "jotai"
import {
  $yourPlayer,
  $actorPlayer,
  $round,
  $currentTurn,
} from "../../state/$state"
import { useEffect, memo } from "react"
import { sounds } from "../../sounds/sounds"

export const Countdown = memo(() => {
  const yourPlayer = useAtomValue($yourPlayer)
  const actorPlayer = useAtomValue($actorPlayer)
  const round = useAtomValue($round)
  const currentTurn = useAtomValue($currentTurn)

  useEffect(() => {
    sounds.countdown.play()
  }, [])

  if (!currentTurn) return null

  return (
    <Root>
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
        startedAt={currentTurn.timerStartedAt}
        duration={turnCountdown}
      />
    </Root>
  )
})

const Root = styled.div`
  animation: fadeIn 300ms ease-out forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
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
