import styled from "styled-components/macro"
import { useAtomValue } from "jotai"
import { $gameStarted } from "../state/$state"
import { Start } from "./Start"
import { Game } from "./Game"

export function App() {
  const gameStarted = useAtomValue($gameStarted)

  return <Root>{gameStarted ? <Game /> : <Start />}</Root>
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #00a6ff 0%, green 100%);
`
