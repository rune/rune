import styled from "styled-components/macro"
import { useAtomValue, useAtom } from "jotai"
import { $hints, $gameOver } from "../../state/$game"
import { maxHints } from "../../lib/maxHints"
import { $inputMode } from "../../state/$inputMode"
import penIcon from "./pen.svg"
import penActiveIcon from "./penActive.svg"
import bulbIcon from "./bulb.svg"
import { rel } from "../../style/rel"
import { useCallback } from "react"

export function ControlPanel() {
  const gameOver = useAtomValue($gameOver)
  const hints = useAtomValue($hints)
  const hintsLeft = maxHints - hints.length
  const [inputMode, setInputMode] = useAtom($inputMode)

  const toggleInputMode = useCallback(() => {
    setInputMode((inputMode) => (inputMode === "value" ? "note" : "value"))
  }, [setInputMode])

  const hintsDisabled = hintsLeft === 0 || gameOver

  const showHint = useCallback(() => {
    if (!hintsDisabled) Rune.actions.showHint()
  }, [hintsDisabled])

  return (
    <Root>
      <Button active={inputMode === "note"} onClick={toggleInputMode}>
        <Img src={inputMode === "note" ? penActiveIcon : penIcon} />
        <Label>Notes</Label>
      </Button>
      <Button disabled={hintsDisabled} onClick={showHint}>
        <Img src={bulbIcon} />
        <Label>Hint</Label>
        {hintsLeft > 0 && <Badge>{hintsLeft}</Badge>}
      </Button>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: ${rel(40)};
  }
`

const Button = styled.div<{ active?: boolean; disabled?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ active }) => (active ? "#FF9846" : "#a4a9a5")};
  opacity: ${({ disabled }) => (disabled ? 0.2 : 1)};
`

const Img = styled.img`
  width: ${rel(24)};
  width: ${rel(24)};
`

const Label = styled.div`
  font-size: ${rel(12)};
  font-weight: 400;
`

const Badge = styled.div`
  position: absolute;
  top: ${rel(-4)};
  right: ${rel(-2)};
  width: ${rel(14)};
  height: ${rel(14)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #985719;
  font-size: ${rel(12)};
  font-weight: 300;
  color: #a4a9a5;
`
