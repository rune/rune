import { useMemo, memo } from "react"
import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { useTimerValue } from "./useTimerValue"

export const PieTimer = memo(
  ({
    startedAt,
    duration,
    almostOverAt,
  }: {
    startedAt?: number
    duration: number
    almostOverAt?: number
  }) => {
    const value = useTimerValue({ startedAt, duration })

    const path = useMemo(() => {
      if (value === null) return ""

      const sector = 1 - (duration - value) / duration

      const [startX, startY] = calculateCoordinates(0)
      const [endX, endY] = calculateCoordinates(sector)
      const largeArcFlag = sector > 0.5 ? 1 : 0

      return [
        `M ${startX} ${startY}`, // Move
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
        "L 0 0", // Line
      ].join(" ")
    }, [duration, value])

    if (value === null) return null

    const almostOver = almostOverAt !== undefined && value <= almostOverAt

    return (
      <Root>
        <SvgRoot viewBox="-1 -1 2 2" almostOver={almostOver}>
          <path d={path}></path>
        </SvgRoot>
        <Text almostOver={almostOver}>{Math.ceil(value)}</Text>
      </Root>
    )
  }
)

const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${rel(160)};
  height: ${rel(160)};
`

const SvgRoot = styled.svg<{ almostOver: boolean }>`
  position: absolute;
  transform: rotate(-90deg) scaleY(-1);
  border-radius: 50%;
  
  ${({ almostOver }) =>
    almostOver
      ? css`
          border: ${rel(6)} solid #f34545;
          path {
            fill: rgba(243, 69, 69, 0.4);
          }
        `
      : css`
          border: ${rel(6)} solid #8bff6a;
          path {
            fill: rgba(113, 217, 84, 0.8);
          }
        `}};

`

const Text = styled.div<{ almostOver: boolean }>`
  font-size: ${rel(48)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
  z-index: 1;
`

function calculateCoordinates(value: number) {
  const x = Math.cos(2 * Math.PI * value)
  const y = Math.sin(2 * Math.PI * value)
  return [x, y]
}
