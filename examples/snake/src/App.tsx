import "./base.css"
import { styled } from "styled-components"
import { InputTracker } from "./components/InputTracker.tsx"
import { Board } from "./components/Board.tsx"
import { Header } from "./components/Header.tsx"
import { useAtomValue } from "jotai"
import { $stage } from "./state/state.ts"
import { GettingReady } from "./components/GettingReady.tsx"
import { Countdown } from "./components/Countdown.tsx"
import { EndOfRound } from "./components/EndOfRound.tsx"

export function App() {
  const stage = useAtomValue($stage)

  return (
    <>
      <Root>
        {stage === "gettingReady" ? (
          <GettingReady />
        ) : (
          <>
            {stage === "playing" && <InputTracker />}
            <Header />
            <CanvasContainer>
              <Board />
            </CanvasContainer>
          </>
        )}
        {stage === "countdown" && <Countdown />}
        {stage === "endOfRound" && <EndOfRound />}
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

const CanvasContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  background: blue;
`
