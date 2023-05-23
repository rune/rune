import { Coordinate } from "../../lib/types/GameState"
import { useAtomValue, useSetAtom } from "jotai"
import { $boardRef } from "../../state/$boardRef"
import { useMemo, useState, useLayoutEffect, useEffect } from "react"
import { calculateBoardRect, Rect } from "../../lib/calculateBoardRect"
import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { randomString } from "../../lib/randomString"
import { cellPointer } from "../../lib/cellPointer"
import { $animatingHints } from "../../state/$animatingHints"
import {
  simpleCSSTransitionStyles,
  SimpleCSSTransition,
} from "../animation/SimpleCSSTransition"
import { sounds } from "../../sounds/sounds"
import { Player } from "@lottiefiles/react-lottie-player"
import lottieExplosion from "./lottieExplosion.json"

export function Hint({ hint }: { hint: Coordinate }) {
  const boardRef = useAtomValue($boardRef)
  const animationKey = useMemo(() => randomString(10), [])
  const [visible, setVisible] = useState(true)
  const setAnimatingHints = useSetAtom($animatingHints)
  const [labelVisible, setLabelVisible] = useState(true)
  const [explosionVisible, setExplosionVisible] = useState(false)

  useLayoutEffect(() => {
    setAnimatingHints((prev) => ({ ...prev, [cellPointer(hint)]: true }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      setAnimatingHints((prev) => ({ ...prev, [cellPointer(hint)]: false }))
      sounds.hint.play()
      setExplosionVisible(true)
    }, Math.round((step(5) / 100) * total))
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handle = setTimeout(
      () => setLabelVisible(false),
      Math.round((step(2) / 100) * total)
    )
    return () => clearTimeout(handle)
  }, [])

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

  return (
    <>
      <Root animationKey={animationKey} frames={frames}>
        <SimpleCSSTransition visible={labelVisible} duration={200}>
          <LabelBox>
            <Label>Hint Used!</Label>
          </LabelBox>
        </SimpleCSSTransition>
      </Root>
      {explosionVisible && (
        <LottieExplosion
          autoplay
          src={lottieExplosion}
          keepLastFrame
          style={{
            left: frames[2].x + frames[2].width / 2,
            top: frames[2].y + frames[2].height / 2,
          }}
        />
      )}
    </>
  )
}

const timings = [400, 600, 400, 600, 400, 600, 400]
export const total = timings.reduce((a, b) => a + b, 0)
const step = (i: number) =>
  Math.round((timings.slice(0, i).reduce((a, b) => a + b, 0) / total) * 100)

const Root = styled.div<{
  animationKey: string
  frames: Rect[]
}>`
  @keyframes ${({ animationKey }) => animationKey} {
    ${({ frames }) => css`
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
  ${({ frames }) => css`
    opacity: 0;
    top: ${frames[0].y}px;
    left: ${frames[0].x}px;
    width: ${frames[0].width}px;
    height: ${frames[0].height}px;
  `};
  animation: ${({ animationKey }) => animationKey} ${total}ms ease-in forwards;

  display: flex;
  align-items: center;
  justify-content: center;
`

const LabelBox = styled.div`
  background: rgba(11, 28, 36, 0.8);
  border-radius: ${rel(16)};
  padding: ${rel(10)};
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
`

const Label = styled.div`
  font-size: ${rel(32)};
  font-weight: 600;

  background: linear-gradient(180deg, #00a486 0%, #75ffcd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const LottieExplosion = styled(Player)`
  position: absolute;
  width: ${rel(100)};
  height: ${rel(100)};
  transform: translate(-50%, -50%);
  pointer-events: none;
`
