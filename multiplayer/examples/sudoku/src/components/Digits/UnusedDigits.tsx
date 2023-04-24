import styled, { css } from "styled-components/macro"
import { range } from "../../lib/range"

export function UnusedDigits({ count }: { count: number }) {
  return (
    <Root>
      {range(9).map((i) => (
        <Circle key={i} visible={i < count} />
      ))}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  align-items: center;
  height: 0.65vw;
`

const Circle = styled.div<{ visible: boolean }>`
  transition: all 0.2s ease-out;
  ${({ visible }) =>
    visible
      ? css`
          width: 0.65vw;
          height: 0.65vw;
          :not(:first-child) {
            margin-left: 0.35vw;
          }
        `
      : css`
          width: 0;
          height: 0;
        `};
  border-radius: 0.65vw;
  background: #f5d6c1;
`
