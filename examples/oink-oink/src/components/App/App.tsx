import styled from "styled-components/macro"
import { useAtomValue } from "jotai"
import { $gameStarted } from "../../state/$state"
import { Start } from "../Start/Start"
import { Game } from "../Game/Game"

import background from "./background.svg"

export function App() {
  const gameStarted = useAtomValue($gameStarted)

  // TODO: onboarding

  return <Root>{gameStarted ? <Game /> : <Start />}</Root>
}

const Root = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: url("${background}") no-repeat;
  background-size: 100% 100%;
`
