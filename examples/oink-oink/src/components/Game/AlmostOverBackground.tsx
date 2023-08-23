import { useTimerValue } from "../Timer/useTimerValue"
import { turnDuration, turnAlmostOverAt } from "../../logic"
import { useAtomValue } from "jotai"
import { $currentTurn } from "../../state/$state"
import styled from "styled-components/macro"

export function AlmostOverBackground() {
  const currentTurn = useAtomValue($currentTurn)

  const turnTimerValue =
    useTimerValue({
      startedAt: currentTurn?.timerStartedAt,
      duration: turnDuration,
    }) ?? 0

  return turnTimerValue <= turnAlmostOverAt ? <Root /> : null
}

const Root = styled.div`
  z-index: -1;
  position: absolute;
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
  animation: pulsing 750ms ease-in-out infinite;
`
