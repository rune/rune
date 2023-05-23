import styled from "styled-components/macro"
import { useAtomValue } from "jotai"
import { range } from "../../lib/range"
import { rel } from "../../style/rel"
import { $inputMode } from "../../state/$inputMode"
import { Digit } from "./Digit"

export function Digits() {
  const inputMode = useAtomValue($inputMode)

  return (
    <Root>
      <Hint visible={inputMode === "note"}>Notes mode on</Hint>
      <Rows>
        <Row>
          {range(1, 6).map((value) => (
            <Digit key={value} value={value} />
          ))}
        </Row>
        <Row>
          {range(6, 10).map((value) => (
            <Digit key={value} value={value} />
          ))}
          <Digit value={null} />
        </Row>
      </Rows>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(9)};
  }
`

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(12)};
  }
`

const Hint = styled.div<{ visible: boolean }>`
  font-size: ${rel(10)};
  font-weight: 600;
  color: #f8d5af;
  text-align: center;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`

const Row = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: ${rel(12)};
  }
`
