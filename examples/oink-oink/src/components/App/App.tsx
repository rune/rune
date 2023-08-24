import styled from "styled-components/macro"
import { useAtomValue } from "jotai"
import { $gameStarted } from "../../state/$state"
import { Start } from "../Start/Start"
import { Game } from "../Game/Game"

import background from "./background.svg"
import { ImagePreloader } from "./ImagePreloader"

export function App() {
  const gameStarted = useAtomValue($gameStarted)

  return (
    <Root>
      <ImagePreloader />
      {gameStarted ? <Game /> : <Start />}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: url("${background}") no-repeat;
  background-size: 100% 100%;
`
