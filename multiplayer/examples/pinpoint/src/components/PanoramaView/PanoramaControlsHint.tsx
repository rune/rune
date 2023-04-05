import styled from "styled-components/macro"
import { Overlay } from "../Overlay"
import arrowLeft from "./img/hintArrowLeft.svg"
import arrowRight from "./img/hintArrowRight.svg"
import arrowUp from "./img/hintArrowUp.svg"
import arrowDown from "./img/hintArrowDown.svg"

export function PanoramaControlsHint() {
  return (
    <>
      <Background />
      <Content>
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
      </Content>
    </>
  )
}

const Background = styled(Overlay)`
  background-color: black;
  opacity: 0.4;
  pointer-events: none;
`

const Content = styled(Overlay)`
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
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
`
