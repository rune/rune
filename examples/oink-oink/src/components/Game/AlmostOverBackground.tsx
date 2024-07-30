import { useTimerValue } from "../Timer/useTimerValue"
import { turnDuration, turnAlmostOverAt } from "../../logic"
import { useAtomValue } from "jotai"
import { $currentTurn } from "../../state/$state"
import styled from "styled-components/macro"
import { useEffect, memo } from "react"
import { sounds } from "../../sounds/sounds"

export const AlmostOverBackground = memo(() => {
  const currentTurn = useAtomValue($currentTurn)

  const turnTimerValue =
    useTimerValue({
      startedAt: currentTurn?.timerStartedAt,
      duration: turnDuration,
    }) ?? 0

  const almostOver = turnTimerValue <= turnAlmostOverAt

  useEffect(() => {
    if (almostOver) {
      sounds.timer.play()
      return () => {
        sounds.timer.stop()
      }
    }
  }, [almostOver])

  return almostOver ? <Root /> : null
})

const Root = styled.div`
  z-index: -1;
  // has to be fixed, scale animation causes actual layout changes on Android (and UI then can be moved by swiping)
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    62.56% 62.56% at 50% 44.09%,
    #ff5631 0%,
    #57112b 81.77%,
    #310414 100%
  );
  animation:
    fadeIn 600ms ease-out forwards,
    pulsing 750ms ease-in-out infinite;
`
