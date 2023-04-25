import styled, { css } from "styled-components/macro"
import { $yourSelection, $board } from "../../state/$game"
import { useAtomValue } from "jotai"
import { cellPointer } from "../../lib/cellPointer"
import { useMemo } from "react"
import { UnusedDigits } from "./UnusedDigits"
import backspaceImg from "./backspace.svg"
import { range } from "../../lib/range"
import { rel } from "../../style/rel"
import { $inputMode } from "../../state/$inputMode"

export function Digits() {
  const yourSelection = useAtomValue($yourSelection)
  const board = useAtomValue($board)
  const inputMode = useAtomValue($inputMode)

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

    const cell = board[cellPointer(yourSelection)]

    if (inputMode === "note") {
      if (cell.value) return
      Rune.actions.toggleNote({ value })
    } else {
      if (cell.fixed) return
      Rune.actions.setValue({ value, clientValueLock: cell.valueLock })
    }
  }

  return (
    <Root>
      <Hint visible={inputMode === "note"}>Notes mode on</Hint>
      <Rows>
        <Row>
          {range(1, 6).map((value) => (
            <Digit
              key={value}
              onClick={() => setValue(value)}
              notesMode={inputMode === "note"}
            >
              <Label>{value}</Label>
              {inputMode === "value" && (
                <UnusedDigits count={remainingDigits[value]} />
              )}
            </Digit>
          ))}
        </Row>
        <Row>
          {range(6, 10).map((value) => (
            <Digit
              key={value}
              onClick={() => setValue(value)}
              notesMode={inputMode === "note"}
            >
              <Label>{value}</Label>
              {inputMode === "value" && (
                <UnusedDigits count={remainingDigits[value]} />
              )}
            </Digit>
          ))}
          <Digit
            onClick={() => setValue(null)}
            notesMode={inputMode === "note"}
          >
            <BackspaceImg src={backspaceImg} />
          </Digit>
        </Row>
      </Rows>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(9)};
  }
`

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(12)};
  }
`

const Hint = styled.div<{ visible: boolean }>`
  font-size: ${rel(10)};
  font-weight: 600;
  color: #f8d5af;
  text-align: center;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`

const Row = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: ${rel(12)};
  }
`

const Digit = styled.div<{ notesMode: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > :not(:first-child) {
    margin-top: ${rel(8)};
  }

  width: ${rel(44)};
  height: ${rel(44)};

  border-radius: ${rel(4)};

  ${({ notesMode }) =>
    notesMode
      ? css`
          border: ${rel(1)} solid #9b5212;
        `
      : css`
          background: linear-gradient(180deg, #965a1c 0%, #9f4a09 100%);
          box-shadow: 0 ${rel(4)} ${rel(5)} #1e2832;
        `};
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
