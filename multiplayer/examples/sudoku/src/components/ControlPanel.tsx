import styled from "styled-components/macro"
import { useAtomValue, useAtom } from "jotai"
import { $hints } from "../state/$game"
import { maxHints } from "../lib/maxHints"
import { $inputMode } from "../state/$inputMode"

export function ControlPanel() {
  const hints = useAtomValue($hints)
  const hintsLeft = maxHints - hints.length
  const [inputMode, setInputMode] = useAtom($inputMode)

  return (
    <Root>
      <button
        onClick={() => setInputMode(inputMode === "value" ? "note" : "value")}
      >
        notes {inputMode === "value" ? "off" : "on"}
      </button>
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
