import "./base.css"
import { styled } from "styled-components"
import { useAtomValue } from "jotai"
import { $stage } from "./state/state.ts"
import { GettingReadyScreen } from "./components/GettingReadyScreen/GettingReadyScreen.tsx"
import { CountdownOverlay } from "./components/CountdownOverlay.tsx"
import { EndOfRoundOverlay } from "./components/EndOfRoundOverlay.tsx"
import { BoardScreen } from "./components/BoardScreen/BoardScreen.tsx"
import { gridBackground } from "./lib/gridBackground.ts"
import { useEffect } from "react"
import { playSound } from "./sounds.ts"

export function App() {
  const stage = useAtomValue($stage)

  useEffect(() => {
    const listener = () => {
      playSound("background")
    }

    //Try to play background music. If it fails, wait for user to interact with website.
    //This should only be necessary in browser.
    playSound("background", true).catch(() => {
      document.addEventListener("click", listener)
    })

    return () => {
      document.removeEventListener("click", listener)
    }
  }, [])

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
  ${gridBackground};
  display: flex;
  flex-direction: column;
`
