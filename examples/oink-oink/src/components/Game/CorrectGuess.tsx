import styled from "styled-components/macro"
import { Guess } from "../../lib/types/GameState"
import { $yourPlayerId } from "../../state/$state"
import { useAtomValue } from "jotai"

export function CorrectGuess(guess: Guess) {
  const yourPlayerId = useAtomValue($yourPlayerId)

  return (
    <Root>
      {guess.playerId === yourPlayerId ? "you got it" : "someone got it"}
    </Root>
  )
}

const Root = styled.div``
