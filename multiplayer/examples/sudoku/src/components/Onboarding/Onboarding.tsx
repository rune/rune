import React, { useState, useLayoutEffect, useEffect } from "react"
import styled from "styled-components/macro"
import { Coordinate } from "../../lib/types/GameState"
import { rel } from "../../style/rel"
import { useAtom, useAtomValue } from "jotai"
import {
  SimpleCSSTransition,
  simpleCSSTransitionStyles,
} from "../animation/SimpleCSSTransition"
import { $onboardingVisible } from "../../state/$onboardingVisible"
import { $boardRef } from "../../state/$boardRef"
import { calculateBoardRect, Rect } from "../../lib/calculateBoardRect"

const ranges: [Coordinate, Coordinate][] = [
  [
    { row: 4, col: 0 },
    { row: 4, col: 8 },
  ],
  [
    { row: 0, col: 1 },
    { row: 8, col: 1 },
  ],
  [
    { row: 0, col: 0 },
    { row: 2, col: 2 },
  ],
]

export function Onboarding() {
  const [rangeRects, setRangeRects] = useState<Rect[]>([])
  const [visibleHighlight, setVisibleHighlight] = useState(0)
  const [onboardingVisible, setOnboardingVisible] = useAtom($onboardingVisible)
  const boardRef = useAtomValue($boardRef)

  useLayoutEffect(() => {
    if (!boardRef) return

    setRangeRects(
      ranges.map(([from, to]) => calculateBoardRect(boardRef, from, to))
    )
  }, [boardRef])

  useEffect(() => {
    if (rangeRects.length > 0 && visibleHighlight === rangeRects.length) {
      if (onboardingVisible) setOnboardingVisible(false)
    } else {
      const handle = setTimeout(() => setVisibleHighlight((i) => i + 1), 2000)
      return () => clearTimeout(handle)
    }
  }, [
    onboardingVisible,
    rangeRects.length,
    setOnboardingVisible,
    visibleHighlight,
  ])

  return (
    <SimpleCSSTransition visible={onboardingVisible} duration={400}>
      <Root>
        <svg width="100%" height="100%">
          <defs>
            <mask id="cutout">
              <rect width="100%" height="100%" fill="white" />
              {rangeRects.map((rect, i) => (
                <rect key={i} {...rect} fill="black" />
              ))}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(75, 110, 135, 0.8)"
            mask="url(#cutout)"
          />
        </svg>
        {rangeRects.map((cutout, i) => (
          <Highlight
            key={i}
            visible={i === visibleHighlight}
            style={{
              left: cutout.x,
              top: cutout.y,
              width: `calc(${cutout.width}px + ${rel(8)})`,
              height: `calc(${cutout.height}px + ${rel(8)})`,
            }}
          />
        ))}
        <Text>
          Every row, column and 3x3 grid should contain the numbers 1-9.
        </Text>
      </Root>
    </SimpleCSSTransition>
  )
}

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
`

const Highlight = styled.div<{ visible: boolean }>`
  position: absolute;
  border: ${rel(4)} solid #ff9c3a;
  margin: -${rel(4)};
  border-radius: ${rel(4)};
  filter: drop-shadow(0 ${rel(4)} ${rel(5)} rgba(0, 0, 0, 0.67));
  transition: opacity 0.4s ease-out;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`

const Text = styled.div`
  position: absolute;
  text-align: center;
  padding: 0 ${rel(32)};
  bottom: 10%;
  font-size: ${rel(16)};
  font-weight: 600;
  line-height: 130%;
  color: white;
`
