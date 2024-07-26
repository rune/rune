import styled from "styled-components/macro"
import arrowUp from "./img/hintArrowUp.svg"
import { SimpleCSSTransition } from "../animation/SimpleCSSTransition"
import { timings } from "../animation/config"

export function GuessHint({ visible }: { visible: boolean }) {
  return (
    <SimpleCSSTransition visible={visible} duration={timings.default}>
      <Root>
        <Text>tap to guess</Text>
        <Arrow src={arrowUp} />
      </Root>
    </SimpleCSSTransition>
  )
}

const Root = styled.div`
  display: flex;
  align-items: center;
`

const Arrow = styled.img`
  transform: rotate(90deg);
`

const Text = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: white;
  text-shadow:
    -1px 0 black,
    0 1px black,
    1px 0 black,
    0 -1px black;
`
