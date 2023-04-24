import { Coordinate } from "../../lib/types/GameState"
import { useAtomValue } from "jotai"
import { $boardRef } from "../../state/$boardRef"
import { useMemo, useEffect, useState } from "react"
import { calculateBoardRect, Rect } from "../../lib/calculateBoardRect"
import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { randomString } from "../../lib/randomString"

export function Hint({ hint }: { hint: Coordinate }) {
  const boardRef = useAtomValue($boardRef)
  const animationKey = useMemo(() => randomString(10), [])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handle = setTimeout(() => setVisible(false), total)
    return () => clearTimeout(handle)
  }, [])

  const frames = useMemo(() => {
    if (!boardRef) return

    const section = {
      row: Math.floor(hint.row / 3) * 3,
      col: Math.floor(hint.col / 3) * 3,
    }

    return [
      calculateBoardRect(boardRef, { row: 0, col: 0 }, { row: 8, col: 8 }),
      calculateBoardRect(
        boardRef,
        { row: section.row, col: section.col },
        { row: section.row + 2, col: section.col + 2 }
      ),
      calculateBoardRect(boardRef, hint, hint),
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef, hint?.row, hint?.col])

  if (!frames || !visible) return null

  return <Root animationKey={animationKey} frames={frames} />
}

const timings = [400, 600, 400, 600, 400, 600, 400]
const total = timings.reduce((a, b) => a + b, 0)
const step = (i: number) =>
  (timings.slice(0, i).reduce((a, b) => a + b, 0) / total) * 100

const Root = styled.div<{
  animationKey: string
  frames: Rect[]
}>`
  @keyframes ${({ animationKey }) => animationKey} {
    ${({ frames }) => css`
      ${step(0)} % {
        opacity: 0;
        top: ${frames[0].y}px;
        left: ${frames[0].x}px;
        width: ${frames[0].width}px;
        height: ${frames[0].height}px;
      }
      ${step(1)}% {
        opacity: 1;
        top: ${frames[0].y}px;
        left: ${frames[0].x}px;
        width: ${frames[0].width}px;
        height: ${frames[0].height}px;
      }
      ${step(2)}% {
        opacity: 1;
        top: ${frames[0].y}px;
        left: ${frames[0].x}px;
        width: ${frames[0].width}px;
        height: ${frames[0].height}px;
      }
      ${step(3)}% {
        opacity: 1;
        top: ${frames[1].y}px;
        left: ${frames[1].x}px;
        width: ${frames[1].width}px;
        height: ${frames[1].height}px;
      }
      ${step(4)}% {
        opacity: 1;
        top: ${frames[1].y}px;
        left: ${frames[1].x}px;
        width: ${frames[1].width}px;
        height: ${frames[1].height}px;
      }
      ${step(5)}% {
        opacity: 1;
        top: ${frames[2].y}px;
        left: ${frames[2].x}px;
        width: ${frames[2].width}px;
        height: ${frames[2].height}px;
      }
      ${step(6)}% {
        opacity: 1;
        top: ${frames[2].y}px;
        left: ${frames[2].x}px;
        width: ${frames[2].width}px;
        height: ${frames[2].height}px;
      }
      ${step(7)}% {
        opacity: 0;
        top: ${frames[2].y}px;
        left: ${frames[2].x}px;
        width: ${frames[2].width}px;
        height: ${frames[2].height}px;
      }
    `};
  }

  position: absolute;
  background-color: rgba(63, 255, 220, 0.5);
  border: ${rel(2)} solid #3fffdc;
  opacity: 0;
  animation: ${({ animationKey }) => animationKey} ${total}ms ease-in forwards;
`
