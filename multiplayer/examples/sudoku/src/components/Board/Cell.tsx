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
      <Highlight
        withBorder={!!selections?.includes(yourPlayerId ?? "")}
        tint={
          selections
            ? selections.length === 1
              ? colors[selections[0]]
              : [150, 150, 150]
            : null
        }
      />

      <Value fixed={cell.fixed}>{cell.value}</Value>
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

const Value = styled.div<{ fixed: boolean }>`
  color: ${({ fixed }) => (fixed ? "#995618" : "#F8D5AF")};
  font-weight: 600;
  font-size: 7vw;
  z-index: 1;
`

const Highlight = styled.div<{ tint: Color | null; withBorder: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${({ tint }) =>
    tint ? `rgba(${tint.join(", ")}, 0.3)` : "transparent"};
  transition: all 0.2s ease-out;

  ${({ withBorder, tint }) =>
    withBorder &&
    css`
      width: calc(100% + 1.8vw);
      height: calc(100% + 1.8vw);
      border: 0.9vw solid ${tint ? `rgb(${tint.join(", ")})` : "transparent"};
      z-index: 1;
    `};
`
