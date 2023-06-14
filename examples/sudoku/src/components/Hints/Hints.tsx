import styled from "styled-components/macro"
import { useAtomValue } from "jotai"
import { $hints } from "../../state/$game"
import { Hint } from "./Hint"
import { useRef } from "react"

export function Hints() {
  const hints = useAtomValue($hints)
  const initialLength = useRef(hints.length)

  return (
    <Root>
      {hints.slice(initialLength.current).map((hint, i) => (
        <Hint key={i} hint={hint} />
      ))}
    </Root>
  )
}

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`
