import styled from "styled-components/macro"
import React from "react"
import range from "lodash/range"
import { Cell } from "./Cell"
import { useAtomValue } from "jotai"
import { $gameOver } from "../../state/state"

export function Board() {
  const gameOver = useAtomValue($gameOver)

  return (
    <Root>
      {range(0, 9).map((row) => (
        <Row key={row}>
          {range(0, 9).map((col) => (
            <Cell key={col} row={row} col={col} gameOver={gameOver} />
          ))}
        </Row>
      ))}
    </Root>
  )
}

const Root = styled.div`
  width: 95vw;
  height: 95vw;
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: 0.3vw;
    :nth-child(3n + 1) {
      margin-top: 0.9vw;
    }
  }
`

const Row = styled.div`
  display: flex;
  flex: 1;
  > :not(:first-child) {
    margin-left: 0.3vw;
    :nth-child(3n + 1) {
      margin-left: 0.9vw;
    }
  }
`
