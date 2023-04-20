import styled from "styled-components/macro"
import range from "lodash/range"
import { $yourSelection, $board } from "../state/state"
import { useAtomValue } from "jotai"
import { cellPointer } from "../lib/cellPointer"

export function Digits() {
  const yourSelection = useAtomValue($yourSelection)
  const board = useAtomValue($board)

  if (!yourSelection || !board) return null

  const clientValueLock = board[cellPointer(yourSelection)].valueLock

  return (
    <Root>
      <Row>
        {range(1, 6).map((value) => (
          <Digit
            key={value}
            onClick={() => Rune.actions.setValue({ value, clientValueLock })}
          >
            {value}
          </Digit>
        ))}
      </Row>
      <Row>
        {range(6, 10).map((value) => (
          <Digit
            key={value}
            onClick={() => Rune.actions.setValue({ value, clientValueLock })}
          >
            {value}
          </Digit>
        ))}
        <Digit
          onClick={() =>
            Rune.actions.setValue({ value: null, clientValueLock })
          }
        >
          {"<"}
        </Digit>
      </Row>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: 4vw;
  }
`

const Row = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: 4vw;
  }
`

const Digit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 13vw;
  height: 13vw;

  background: linear-gradient(180deg, #965a1c 0%, #9f4a09 100%);
  box-shadow: 0 4px 5px #1e2832;
  border-radius: 1vw;

  font-size: 7.5vw;
  font-weight: 600;
  color: #f5d6c1;
`
