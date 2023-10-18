import "./base.css"
import { styled } from "styled-components"
import { useAtomValue } from "jotai"
import { $stage } from "./state/state.ts"
import { GettingReadyScreen } from "./components/GettingReadyScreen.tsx"
import { CountdownOverlay } from "./components/CountdownOverlay.tsx"
import { EndOfRoundOverlay } from "./components/EndOfRoundOverlay.tsx"
import { BoardScreen } from "./components/BoardScreen.tsx"

export function App() {
  const stage = useAtomValue($stage)

  return (
    <>
      <Root>
        {stage === "gettingReady" ? <GettingReadyScreen /> : <BoardScreen />}
        {stage === "countdown" && <CountdownOverlay />}
        {stage === "endOfRound" && <EndOfRoundOverlay />}
      </Root>
    </>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  flex-direction: column;
`
