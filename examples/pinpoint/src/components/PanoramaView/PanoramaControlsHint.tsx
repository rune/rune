import styled from "styled-components/macro"
import { Overlay } from "../Overlay"
import arrowLeft from "./img/hintArrowLeft.svg"
import arrowRight from "./img/hintArrowRight.svg"
import arrowUp from "./img/hintArrowUp.svg"
import arrowDown from "./img/hintArrowDown.svg"
import {
  SimpleCSSTransition,
  simpleCSSTransitionStyles,
} from "../animation/SimpleCSSTransition"
import { timings } from "../animation/config"

export function PanoramaControlsHint({ visible }: { visible: boolean }) {
  return (
    <SimpleCSSTransition visible={visible} duration={timings.default}>
      <Root>
        <Top>
          <img src={arrowLeft} />
          <Text>swipe to turn</Text>
          <img src={arrowRight} />
        </Top>
        <Bottom>
          <img src={arrowDown} />
          <Text>pinch to zoom</Text>
          <img src={arrowUp} />
        </Bottom>
      </Root>
    </SimpleCSSTransition>
  )
}

const Root = styled(Overlay)`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  padding: 10px;
  pointer-events: none;
`

const Top = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Bottom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  > :not(:first-child) {
    margin-top: 10px;
  }
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
