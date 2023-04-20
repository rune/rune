import styled, { css } from "styled-components/macro"
import { Color } from "../../logic/types/GameState"
import { useAtomValue } from "jotai"
import { $board, $selections, $yourPlayerId, $colors } from "../../state/state"
import { cellPointer } from "../../lib/cellPointer"
import React from "react"

export function Cell({ row, col }: { row: number; col: number }) {
  const board = useAtomValue($board)
  const selections = useAtomValue($selections)[cellPointer({ row, col })]
  const yourPlayerId = useAtomValue($yourPlayerId)
  const colors = useAtomValue($colors)

  if (!board) return null

  const cell = board[cellPointer({ row, col })]

  return (
    <Root onClick={() => Rune.actions.select({ row, col })}>
      {!!selections?.length && (
        <Highlight
          withBorder={selections.includes(yourPlayerId ?? "")}
          tint={
            selections.length === 1 ? colors[selections[0]] : [255, 255, 255]
          }
        />
      )}
      <Value revealed={cell.revealed}>{cell.value}</Value>
    </Root>
  )
}

const Root = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #0b1c24;
`

const Value = styled.div<{ revealed: boolean }>`
  color: ${({ revealed }) => (revealed ? "#995618" : "#F8D5AF")};
  font-weight: 600;
  font-size: 7vw;
  z-index: 0;
`

const Highlight = styled.div<{ tint: Color; withBorder: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(${({ tint }) => tint.join(", ")}, 0.3);
  ${({ withBorder, tint }) =>
    withBorder &&
    css`
      border: 3px solid rgb(${tint.join(", ")});
    `};
`
