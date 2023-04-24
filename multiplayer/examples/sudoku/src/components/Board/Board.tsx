import styled from "styled-components/macro"
import React from "react"
import { Cell } from "./Cell"
import { useAtomValue, useSetAtom } from "jotai"
import { $gameOver } from "../../state/$game"
import { range } from "../../lib/range"
import { rel } from "../../style/rel"
import { $boardRef } from "../../state/$boardRef"

export function Board() {
  const gameOver = useAtomValue($gameOver)
  const setBoardRef = useSetAtom($boardRef)

  return (
    <Root ref={setBoardRef}>
      {range(9).map((row) => (
        <Row key={row}>
          {range(9).map((col) => (
            <Cell key={col} row={row} col={col} gameOver={gameOver} />
          ))}
        </Row>
      ))}
    </Root>
  )
}

const Root = styled.div`
  width: ${rel(304)};
  height: ${rel(304)};
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(1)};
    :nth-child(3n + 1) {
      margin-top: ${rel(3)};
    }
  }
`

const Row = styled.div`
  display: flex;
  flex: 1;
  > :not(:first-child) {
    margin-left: ${rel(1)};
    :nth-child(3n + 1) {
      margin-left: ${rel(3)};
    }
  }
`
