import styled from "styled-components/macro"
import { $yourSelection, $board } from "../../state/$game"
import { useAtomValue } from "jotai"
import { cellPointer } from "../../lib/cellPointer"
import { useMemo } from "react"
import { UnusedDigits } from "./UnusedDigits"
import backspaceImg from "./backspace.svg"
import { range } from "../../lib/range"
import { rel } from "../../style/rel"

export function Digits() {
  const yourSelection = useAtomValue($yourSelection)
  const board = useAtomValue($board)

  const remainingDigits = useMemo(() => {
    return (board ?? []).reduce<{ [digit: number]: number }>(
      (acc, cell) => ({
        ...acc,
        ...(cell.value && {
          [cell.value]: Math.max((acc[cell.value] ?? 9) - 1, 0),
        }),
      }),
      range(1, 10).reduce<{ [digit: number]: number }>(
        (acc, digit) => ({
          ...acc,
          [digit]: 9,
        }),
        {}
      )
    )
  }, [board])

  function setValue(value: number | null) {
    if (!board || !yourSelection) return

    Rune.actions.setValue({
      value,
      clientValueLock: board[cellPointer(yourSelection)].valueLock,
    })
  }

  return (
    <Root>
      <Row>
        {range(1, 6).map((value) => (
          <Digit key={value} onClick={() => setValue(value)}>
            <Label>{value}</Label>
            <UnusedDigits count={remainingDigits[value]} />
          </Digit>
        ))}
      </Row>
      <Row>
        {range(6, 10).map((value) => (
          <Digit key={value} onClick={() => setValue(value)}>
            <Label>{value}</Label>
            <UnusedDigits count={remainingDigits[value]} />
          </Digit>
        ))}
        <Digit onClick={() => setValue(null)}>
          <BackspaceImg src={backspaceImg} />
        </Digit>
      </Row>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(12)};
  }
`

const Row = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: ${rel(12)};
  }
`

const Digit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > :not(:first-child) {
    margin-top: ${rel(8)};
  }

  width: ${rel(44)};
  height: ${rel(44)};

  background: linear-gradient(180deg, #965a1c 0%, #9f4a09 100%);
  box-shadow: 0 ${rel(4)} ${rel(5)} #1e2832;
  border-radius: ${rel(4)};
`

const Label = styled.div`
  font-size: ${rel(24)};
  font-weight: 600;
  color: #f5d6c1;
`

const BackspaceImg = styled.img`
  width: ${rel(27)};
  height: ${rel(27)};
`
