import styled from "styled-components/macro"
import { useAtomValue, useAtom } from "jotai"
import { $hints, $gameOver } from "../../state/$game"
import { maxHints } from "../../lib/maxHints"
import { $inputMode } from "../../state/$inputMode"
import penIcon from "./pen.svg"
import penActiveIcon from "./penActive.svg"
import bulbIcon from "./bulb.svg"
import bulbActiveIcon from "./bulbActive.svg"
import { rel } from "../../style/rel"
import { useCallback, useState, useEffect } from "react"
import { sounds } from "../../sounds/sounds"
import { total as totalHintDuration } from "../Hints/Hint"

export function ControlPanel() {
  const gameOver = useAtomValue($gameOver)
  const hints = useAtomValue($hints)
  const hintsLeft = maxHints - hints.length
  const [inputMode, setInputMode] = useAtom($inputMode)
  const [hintAnimating, setHintAnimating] = useState(false)

  const toggleInputMode = useCallback(() => {
    sounds.note.play()
    setInputMode((inputMode) => (inputMode === "value" ? "note" : "value"))
  }, [setInputMode])

  const hintsDisabled = hintsLeft === 0 || gameOver

  const showHint = useCallback(() => {
    if (!hintsDisabled) Rune.actions.showHint()
  }, [hintsDisabled])

  useEffect(() => {
    if (hints.length > 0) {
      setHintAnimating(true)
      const handle = setTimeout(
        () => setHintAnimating(false),
        totalHintDuration
      )
      return () => clearTimeout(handle)
    }
  }, [hints.length])

  return (
    <Root>
      <Button active={inputMode === "note"} onClick={toggleInputMode}>
        <Img src={inputMode === "note" ? penActiveIcon : penIcon} />
        <Label>Notes</Label>
      </Button>
      <Button
        active={hintAnimating}
        disabled={hintsDisabled}
        onClick={showHint}
      >
        <Img src={hintAnimating ? bulbActiveIcon : bulbIcon} />
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
  opacity: ${({ active, disabled }) => (!active && disabled ? 0.2 : 1)};
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
  font-size: ${rel(11)};
  font-weight: 300;
  color: #a4a9a5;
`
