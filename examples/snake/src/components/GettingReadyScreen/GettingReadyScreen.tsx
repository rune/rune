import { styled } from "styled-components"
import { rel } from "../../lib/rel.ts"
import logo from "./logo.png"
import instructions from "./instructions.png"
import { gridBackground } from "../../lib/gridBackground.ts"

export function GettingReadyScreen() {
  return (
    <Root>
      <Logo src={logo} />
      <StartButton onClick={() => Rune.actions.setReady()}>Start</StartButton>
      <Instructions src={instructions} />
    </Root>
  )
}

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  ${gridBackground};
`

const Logo = styled.img`
  width: ${rel(218)};
  height: ${rel(209)};
`

const StartButton = styled.div`
  border: ${rel(2)} solid #ff32d2;
  padding: ${rel(14)} 0 ${rel(12)};
  width: ${rel(244)};
  text-transform: uppercase;
  font-size: ${rel(20)};
  color: #ff32d2;
  border-radius: ${rel(50)};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 ${rel(15)} ${rel(3)} #ff32d2,
    inset 0 0 ${rel(15)} ${rel(3)} #ff32d2;
`

const Instructions = styled.img`
  width: ${rel(246.69)};
  height: ${rel(94)};
`
