import React, { useEffect } from "react"
import styled from "styled-components/macro"

export function App() {


  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame, players, yourPlayerId }) => {
        console.log("visualUpdate", { newGame, players, yourPlayerId })
      },
    })
  }, [])



  return (
    <Root>
      123
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
`
