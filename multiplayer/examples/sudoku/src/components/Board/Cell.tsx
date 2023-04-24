import styled from "styled-components/macro"
import { Color } from "../../lib/types/GameState"
import { useAtomValue } from "jotai"
import { $board, $selections, $yourPlayerId, $colors } from "../../state/$game"
import { cellPointer } from "../../lib/cellPointer"
import React from "react"
import { rel } from "../../style/rel"
import { $onboardingVisible } from "../../state/$onboardingVisible"

import { $animatingHints } from "../../state/$animatingHints"

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
  const animatingHints = useAtomValue($animatingHints)

  if (!board) return <Root />

  const cell = board[cellPointer({ row, col })]

  const tint: Color | null = gameOver
    ? cell.lastModifiedByPlayerId
      ? colors[cell.lastModifiedByPlayerId]
      : null
    : selections
    ? selections.length === 1
      ? colors[selections[0]]
      : [150, 150, 150]
    : null

  return (
    <Root
      onClick={() => Rune.actions.select({ row, col })}
      data-pointer={`cell-${row}-${col}`}
    >
      {onboardingVisible ? (
        cell.fixed && <Value fixed={cell.fixed}>{cell.value}</Value>
      ) : (
        <>
          <Highlight tint={tint} />
          {!animatingHints[cellPointer({ row, col })] && (
            <Value fixed={cell.fixed}>{cell.value}</Value>
          )}
          <ErrorHighlight enabled={cell.error} />
          <HighlightBorder
            visible={!gameOver && !!selections?.includes(yourPlayerId ?? "")}
            tint={tint}
          />
        </>
      )}
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

const Highlight = styled.div<{ tint: Color | null }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${({ tint }) =>
    tint ? `rgba(${tint.join(", ")}, 0.3)` : "transparent"};
  transition: all 0.2s ease-out;
`

const Value = styled.div<{ fixed: boolean }>`
  position: absolute;
  color: ${({ fixed }) => (fixed ? "#995618" : "#F8D5AF")};
  font-weight: 600;
  font-size: ${rel(24)};
`

const ErrorHighlight = styled.div<{ enabled: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.2s ease-out;
  border: ${rel(2)} solid
    ${({ enabled }) => (enabled ? "#ff3939" : "transparent")};
`

const HighlightBorder = styled.div<{ visible: boolean; tint: Color | null }>`
  position: absolute;
  width: calc(100% + ${rel(6)});
  height: calc(100% + ${rel(6)});
  transition: all 0.2s ease-out;
  border: ${rel(3)} solid
    ${({ tint }) => (tint ? `rgb(${tint.join(", ")})` : "transparent")};
  z-index: 1;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`
