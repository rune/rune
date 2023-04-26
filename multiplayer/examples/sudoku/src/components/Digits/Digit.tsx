import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { useCallback, useMemo } from "react"
import { cellPointer } from "../../lib/cellPointer"
import { useAtomValue } from "jotai"
import { $yourSelection, $board, $gameOver } from "../../state/$game"
import { $inputMode } from "../../state/$inputMode"
import { range } from "../../lib/range"
import { UnusedDigits } from "./UnusedDigits"
import backspaceImg from "./backspace.svg"

export function Digit({ value }: { value: number | null }) {
  const yourSelection = useAtomValue($yourSelection)
  const board = useAtomValue($board)
  const inputMode = useAtomValue($inputMode)
  const cell = board && yourSelection && board[cellPointer(yourSelection)]
  const gameOver = useAtomValue($gameOver)

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

  const disabled = useMemo(
    () =>
      gameOver ||
      (inputMode === "note"
        ? !!cell?.value || (value === null && cell?.notes.length === 0)
        : !!cell?.fixed || cell?.value === value),
    [cell?.fixed, cell?.notes.length, cell?.value, gameOver, inputMode, value]
  )

  const noteEnabled = useMemo(
    () => !!(inputMode === "note" && value && cell?.notes.includes(value)),
    [cell?.notes, inputMode, value]
  )

  const onClick = useCallback(() => {
    if (!cell?.valueLock || disabled) return

    if (inputMode === "note") {
      Rune.actions.toggleNote({ value })
    } else {
      Rune.actions.setValue({ value, clientValueLock: cell.valueLock })
    }
  }, [cell?.valueLock, disabled, inputMode, value])

  return (
    <Root
      disabled={disabled || noteEnabled}
      key={value}
      onClick={onClick}
      notesMode={inputMode === "note"}
    >
      {value === null ? (
        <BackspaceImg src={backspaceImg} />
      ) : (
        <>
          <Label>{value}</Label>
          {inputMode === "value" && (
            <UnusedDigits count={remainingDigits[value]} />
          )}
        </>
      )}
    </Root>
  )
}

const Root = styled.div<{ disabled: boolean; notesMode: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > :not(:first-child) {
    margin-top: ${rel(2)};
  }

  width: ${rel(44)};
  height: ${rel(44)};

  border-radius: ${rel(4)};

  ${({ notesMode, disabled }) =>
    notesMode
      ? css`
          border: ${rel(1)} solid #9b5212;
          opacity: ${disabled ? 0.2 : 1};
        `
      : disabled
      ? css`
          background: linear-gradient(180deg, #965a1c 0%, #9f4a09 100%);
          opacity: 0.2;
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
  line-height: 100%;
`

const BackspaceImg = styled.img`
  width: ${rel(27)};
  height: ${rel(27)};
`
