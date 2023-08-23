import styled, { css } from "styled-components/macro"
import { Guess } from "../../lib/types/GameState"
import { $yourPlayerId, $players } from "../../state/$state"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { rel } from "../../style/rel"
import { art } from "./art/art"

import checkmark from "./checkmark.svg"

export function CorrectGuess(guess: Guess) {
  const yourPlayerId = useAtomValue($yourPlayerId)
  const players = useAtomValue($players)
  const guessPlayer = useMemo(
    () => players.find((p) => p.id === guess.playerId),
    [guess.playerId, players]
  )

  return (
    <Root>
      {guess.playerId === yourPlayerId ? (
        <>
          <CheckmarkImg src={checkmark} />
          <Label big uppercase>
            Correct!
          </Label>
          <div style={{ height: rel(24) }} />
          <GuessContainer>
            <EmotionImg src={art.emotions[guess.emotion]} />
            <Plus>+</Plus>
            <AnimalImg src={art.animals[guess.animal]} />
          </GuessContainer>
        </>
      ) : (
        <>
          <Label>
            {guessPlayer?.info.displayName}
            <br />
            got it!
          </Label>
          <GuessContainer>
            <EmotionImg src={art.emotions[guess.emotion]} />
            <Plus>+</Plus>
            <AnimalImg src={art.animals[guess.animal]} />
          </GuessContainer>
          <div style={{ height: rel(37) }} />
          <AvatarImg src={guessPlayer?.info.avatarUrl} />
          <div style={{ height: rel(12) }} />
          <Score>+1pt</Score>
        </>
      )}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CheckmarkImg = styled.img`
  width: ${rel(304)};
  height: ${rel(304)};
  margin: ${rel(-95)} 0 ${rel(-79 + 24)};
`

const Label = styled.div<{ big?: boolean; uppercase?: boolean }>`
  font-size: ${({ big }) => rel(big ? 64 : 28)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
  text-align: center;
  ${({ uppercase }) =>
    uppercase &&
    css`
      text-transform: uppercase;
    `};
`

const GuessContainer = styled.div`
  display: flex;
  align-items: center;
`

const EmotionImg = styled.img`
  width: ${rel(96)};
  height: ${rel(96)};
`

const Plus = styled.div`
  color: #e4faff;
  text-shadow: 0 ${rel(4.8)} 0 rgba(0, 0, 0, 0.35);
  font-size: ${rel(103)};
  margin: 0 ${rel(27)};
`

const AnimalImg = styled.img`
  width: ${rel(96)};
  height: ${rel(96)};
`

const AvatarImg = styled.img`
  width: ${rel(94)};
  height: ${rel(94)};
`

const Score = styled.div`
  font-size: ${rel(38)};

  background: #23490c;
  -webkit-background-clip: text;
  -webkit-text-stroke: ${rel(1)} transparent;
  background-clip: text;
  text-stroke: ${rel(1)} transparent;
  // this is needed for the stroke renders nicely
  padding: ${rel(1)};

  color: #69c251;
  text-shadow: 0 ${rel(4.5)} ${rel(4.5)} rgba(0, 0, 0, 0.25);
`
