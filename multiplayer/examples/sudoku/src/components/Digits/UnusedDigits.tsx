import styled, { css } from "styled-components/macro"
import { range } from "../../lib/range"
import { relWhole } from "../../style/rel"

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
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  width: calc((${relWhole(2)} + ${relWhole(0.7 * 2)}) * 4);
  height: calc((${relWhole(2)} + ${relWhole(0.5 * 2)}) * 3);
`

const Circle = styled.div<{ visible: boolean }>`
  transition: all 0.2s ease-out;
  ${({ visible }) =>
    visible
      ? css`
          width: ${relWhole(2)};
          height: ${relWhole(2)};
          margin: ${relWhole(0.5)} ${relWhole(0.7)};
        `
      : css`
          width: 0;
          height: 0;
        `};
  border-radius: 50%;
  background: #f5d6c1;
`
