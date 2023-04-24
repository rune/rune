import styled, { css } from "styled-components/macro"
import { range } from "../../lib/range"
import { rel } from "../../style/rel"

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
  height: ${rel(2)};
`

const Circle = styled.div<{ visible: boolean }>`
  transition: all 0.2s ease-out;
  ${({ visible }) =>
    visible
      ? css`
          width: ${rel(2)};
          height: ${rel(2)};
          :not(:first-child) {
            margin-left: ${rel(1.5)};
          }
        `
      : css`
          width: 0;
          height: 0;
        `};
  border-radius: 50%;
  background: #f5d6c1;
`
