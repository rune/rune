import styled from "styled-components/macro"
import React, { useState, useEffect } from "react"
import { Cell } from "./Cell"
import { useAtomValue, useSetAtom } from "jotai"
import { $gameOver } from "../../state/$game"
import { range } from "../../lib/range"
import { rel } from "../../style/rel"
import { $boardRef } from "../../state/$boardRef"
import { $lastSetValueRollback } from "../../state/$lastSetValueRollback"
import {
  SimpleCSSTransition,
  simpleCSSTransitionStyles,
} from "../animation/SimpleCSSTransition"

export function Board() {
  const gameOver = useAtomValue($gameOver)
  const setBoardRef = useSetAtom($boardRef)
  const [conflictAlertVisible, setConflictAlertVisible] = useState(false)
  const lastSetValueRollback = useAtomValue($lastSetValueRollback)

  useEffect(() => {
    if (lastSetValueRollback) {
      setConflictAlertVisible(true)
      const handle = setTimeout(() => setConflictAlertVisible(false), 2000)
      return () => clearTimeout(handle)
    }
  }, [lastSetValueRollback])

  return (
    <Root ref={setBoardRef}>
      {range(9).map((row) => (
        <Row key={row}>
          {range(9).map((col) => (
            <Cell key={col} row={row} col={col} gameOver={gameOver} />
          ))}
        </Row>
      ))}
      <SimpleCSSTransition visible={conflictAlertVisible} duration={200}>
        <AlertContainer>
          <Alert>Someone else edited the cell first! Try again.</Alert>
        </AlertContainer>
      </SimpleCSSTransition>
    </Root>
  )
}

const Root = styled.div`
  position: relative;
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

const AlertContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
`

const Alert = styled.div`
  background: rgba(255, 57, 57, 0.8);
  border-radius: ${rel(16)};
  padding: ${rel(5)} ${rel(10)};
  font-weight: 600;
  font-size: ${rel(9)};
  color: #ffffff;
`
