import styled from "styled-components/macro"
import { useAtomValue } from "jotai"
import { $hints } from "../state/$game"
import { maxHints } from "../lib/maxHints"

export function ControlPanel() {
  const hints = useAtomValue($hints)
  const hintsLeft = maxHints - hints.length

  return (
    <Root>
      <button>notes off</button>
      <button
        disabled={hintsLeft === 0}
        onClick={() => Rune.actions.showHint()}
      >
        hint ({hintsLeft})
      </button>
    </Root>
  )
}

const Root = styled.div``
