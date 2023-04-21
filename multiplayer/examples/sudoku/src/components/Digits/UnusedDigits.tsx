import styled from "styled-components/macro"
import range from "lodash/range"

export function UnusedDigits({ count }: { count: number }) {
  return (
    <Root>
      {range(count).map((i) => (
        <Circle key={i} />
      ))}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  height: 0.65vw;
  > :not(:first-child) {
    margin-left: 0.35vw;
  }
`

const Circle = styled.div`
  width: 0.65vw;
  height: 0.65vw;
  border-radius: 0.65vw;
  background: #f5d6c1;
`
