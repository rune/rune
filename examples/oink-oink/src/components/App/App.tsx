import styled from "styled-components/macro"
import { useAtomValue } from "jotai"
import { $gameStarted, $ready } from "../../state/$state"
import { Start } from "../Start/Start"
import { Game } from "../Game/Game"

import background from "./background.svg"
import { ImagePreloader } from "./ImagePreloader"
import { memo } from "react"

export const App = memo(() => {
  const ready = useAtomValue($ready)
  const gameStarted = useAtomValue($gameStarted)

  if (!ready) return <Root />

  return (
    <Root>
      <ImagePreloader />
      {gameStarted ? <Game /> : <Start />}
    </Root>
  )
})

const Root = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: url("${background}") no-repeat;
  background-size: 100% 100%;
`
