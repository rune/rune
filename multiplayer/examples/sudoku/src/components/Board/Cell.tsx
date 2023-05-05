import styled, { css } from "styled-components/macro"
import { Color } from "../../lib/types/GameState"
import { useAtomValue } from "jotai"
import { $board, $selections, $yourPlayerId, $colors } from "../../state/$game"
import { cellPointer } from "../../lib/cellPointer"
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { rel } from "../../style/rel"
import { $onboardingVisible } from "../../state/$onboardingVisible"

import { $animatingHints } from "../../state/$animatingHints"
import { range } from "../../lib/range"
import {
  useSuccessBlip,
  blipDuration,
  totalBlipsDuration,
} from "./useSuccessBlip"
import {
  isInOnboardingRange,
  ranges,
  frameDuration,
} from "../Onboarding/Onboarding"
import { $secretMode } from "../../state/$secretMode"

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
  const { successBlip } = useSuccessBlip({ row, col })
  const [gameOverMode, setGameOverMode] = useState(false)
  const secretMode = useAtomValue($secretMode)

  useEffect(() => {
    if (gameOver) {
      const handle = setTimeout(
        () => setGameOverMode(true),
        totalBlipsDuration + 500
      )
      return () => clearTimeout(handle)
    }
  }, [gameOver])

  const onClick = useCallback(() => {
    if (gameOver) return
    Rune.actions.select({ row, col })
  }, [col, gameOver, row])

  const onboardingRevealDelay = useMemo(
    () =>
      isInOnboardingRange({ row, col }, ranges[0])
        ? 0
        : isInOnboardingRange({ row, col }, ranges[1])
        ? frameDuration
        : isInOnboardingRange({ row, col }, ranges[2])
        ? 2 * frameDuration
        : undefined,
    [col, row]
  )

  if (!board) return <Root data-pointer={`cell-${row}-${col}`} />

  const cell = board[cellPointer({ row, col })]

  const tint: Color | null = gameOverMode
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
      onClick={onClick}
      data-pointer={`cell-${row}-${col}`}
      blip={successBlip}
    >
      {onboardingVisible ? (
        (cell.fixed || onboardingRevealDelay !== undefined) && (
          <Value
            fixed={cell.fixed}
            onboardingRevealDelay={
              cell.fixed ? undefined : onboardingRevealDelay
            }
          >
            {cell.value}
          </Value>
        )
      ) : (
        <>
          <Highlight tint={tint} />
          {!animatingHints[cellPointer({ row, col })] && (
            <Value fixed={cell.fixed}>{cell.value}</Value>
          )}
          <Notes>
            {range(3).map((row) => (
              <NoteRow key={row}>
                {range(3).map((col) =>
                  ((note) => (
                    <Note
                      key={col}
                      opacity={
                        secretMode
                          ? cell.validValues.includes(note)
                            ? 0.25
                            : 0
                          : cell.notes.includes(note)
                          ? 1
                          : 0
                      }
                    >
                      {note}
                    </Note>
                  ))(row * 3 + col + 1)
                )}
              </NoteRow>
            ))}
          </Notes>
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

const Root = styled.div<{ blip?: boolean }>`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  transition: background-color ${blipDuration}ms ease-out;
  background-color: ${({ blip }) => (blip ? "#245b75" : "#0b1c24")};
`

const Highlight = styled.div<{ tint: Color | null }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${({ tint }) =>
    tint ? `rgba(${tint.join(", ")}, 0.3)` : "transparent"};
  transition: all 0.2s ease-out;
`

const Value = styled.div<{ fixed: boolean; onboardingRevealDelay?: number }>`
  position: absolute;
  color: ${({ fixed }) => (fixed ? "#995618" : "#F8D5AF")};
  font-weight: 600;
  font-size: ${rel(24)};
  
  ${({ onboardingRevealDelay }) =>
    onboardingRevealDelay !== undefined &&
    css`
      opacity: 0;
      animation: ${`${frameDuration}ms ease-in-out ${onboardingRevealDelay}ms forwards onboardingCellReveal`};
    `}};
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

const Notes = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const NoteRow = styled.div`
  display: flex;
  flex: 1;
`

const Note = styled.div<{ opacity: number }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  font-size: ${rel(10)};
  font-weight: 600;
  color: #f8d5af;

  opacity: ${({ opacity }) => opacity};
`
