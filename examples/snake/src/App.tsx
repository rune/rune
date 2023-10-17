import "./base.css"
import { styled } from "styled-components"
import { InputTracker } from "./components/InputTracker.tsx"
import { Board } from "./components/Board.tsx"
import { Header } from "./components/Header.tsx"

export function App() {
  return (
    <>
      <InputTracker />
      <Root>
        <Header />
        <CanvasContainer>
          <Board />
        </CanvasContainer>
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
