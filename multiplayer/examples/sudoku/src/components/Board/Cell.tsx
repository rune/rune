import styled, { css } from "styled-components/macro"
import { Color } from "../../lib/types/GameState"
import { useAtomValue } from "jotai"
import {
  $board,
  $selections,
  $yourPlayerId,
  $colors,
  $onboardingVisible,
} from "../../state/state"
import { cellPointer } from "../../lib/cellPointer"
import React from "react"
import { rel } from "../../style/rel"

export function Cell({
  row,
  col,
  gameOver,
}: {
  row: number
  col: number
  gameOver: boolean
}) {
  const board = useAtomValue($board)
  const selections = useAtomValue($selections)[cellPointer({ row, col })]
  const yourPlayerId = useAtomValue($yourPlayerId)
  const colors = useAtomValue($colors)
  const onboardingVisible = useAtomValue($onboardingVisible)

  if (!board) return <Root />

  const cell = board[cellPointer({ row, col })]

  return (
    <Root
      onClick={() => Rune.actions.select({ row, col })}
      data-pointer={`cell-${row}-${col}`}
    >
      {!onboardingVisible && (
        <Highlight
          withBorder={!gameOver && !!selections?.includes(yourPlayerId ?? "")}
          tint={
            gameOver && cell.lastModifiedByPlayerId
              ? colors[cell.lastModifiedByPlayerId]
              : selections
              ? selections.length === 1
                ? colors[selections[0]]
                : [150, 150, 150]
              : null
          }
        />
      )}
      <ErrorHighlight enabled={cell.error} />
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
  font-size: ${rel(24)};
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
      width: calc(100% + ${rel(6)});
      height: calc(100% + ${rel(6)});
      border: ${rel(3)} solid
        ${tint ? `rgb(${tint.join(", ")})` : "transparent"};
      z-index: 1;
    `};
`

const ErrorHighlight = styled.div<{ enabled: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: border-color 0.2s ease-out;
  border: ${rel(2)} solid
    ${({ enabled }) => (enabled ? "#ff3939" : "transparent")};
  z-index: 1;
`
