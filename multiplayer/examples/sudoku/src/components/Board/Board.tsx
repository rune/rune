import styled from "styled-components/macro"
import React from "react"
import range from "lodash/range"
import { Cell } from "./Cell"

export function Board() {
  return (
    <Root>
      {range(0, 9).map((row) => (
        <Row key={row}>
          {range(0, 9).map((col) => (
            <Cell key={col} row={row} col={col} />
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
    margin-top: 1px;
    :nth-child(3n + 1) {
      margin-top: 3px;
    }
  }
`

const Row = styled.div`
  display: flex;
  flex: 1;
  > :not(:first-child) {
    margin-left: 1px;
    :nth-child(3n + 1) {
      margin-left: 3px;
    }
  }
`
