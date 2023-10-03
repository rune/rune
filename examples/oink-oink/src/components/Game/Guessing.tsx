import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { Animal, Emotion } from "../../lib/types/GameState"
import { art } from "./art/art"
import { useState, useEffect, memo, useMemo } from "react"
import { sounds } from "../../sounds/sounds"
import { useAtomValue } from "jotai"
import { $currentTurn, $round, $animals, $emotions } from "../../state/$state"

const buttonHintDelay = 1.5

export const Guessing = memo(() => {
  const [pendingAnimal, setPendingAnimal] = useState<Animal>()
  const [pendingEmotion, setPendingEmotion] = useState<Emotion>()
  const currentTurn = useAtomValue($currentTurn)
  const round = useAtomValue($round)
  const animals = useAtomValue($animals)
  const emotions = useAtomValue($emotions)

  const invalid = useMemo(
    () =>
      pendingAnimal &&
      pendingEmotion &&
      (pendingAnimal !== currentTurn?.animal ||
        pendingEmotion !== currentTurn?.emotion),
    [currentTurn?.animal, currentTurn?.emotion, pendingAnimal, pendingEmotion]
  )

  const inputDisabled = useMemo(
    () => pendingAnimal && pendingEmotion,
    [pendingAnimal, pendingEmotion]
  )

  useEffect(() => {
    if (pendingAnimal && pendingEmotion) {
      const handle = setTimeout(() => {
        Rune.actions.makeGuess({
          animal: pendingAnimal,
          emotion: pendingEmotion,
          round,
        })
        setPendingAnimal(undefined)
        setPendingEmotion(undefined)
      }, 500)
      return () => clearTimeout(handle)
    }
  }, [pendingAnimal, pendingEmotion, round])

  return (
    <Root>
      <Prompt>Guess the animal</Prompt>
      <Grid>
        {animals.map((animal, i) => (
          <Item
            key={animal}
            selected={pendingAnimal === animal}
            invalid={invalid}
            onClick={() => {
              if (inputDisabled) return
              sounds.guessButton.play()
              setPendingAnimal(animal)
            }}
            animateScaleWithDelay={
              pendingEmotion && !pendingAnimal
                ? i / 2 + buttonHintDelay
                : undefined
            }
          >
            <img src={art.animals[animal]} />
          </Item>
        ))}
      </Grid>
      <Prompt>Guess the emotion</Prompt>
      <Grid>
        {emotions.map((emotion, i) => (
          <Item
            key={emotion}
            selected={pendingEmotion === emotion}
            invalid={invalid}
            onClick={() => {
              if (inputDisabled) return
              sounds.guessButton.play()
              setPendingEmotion(emotion)
            }}
            animateScaleWithDelay={
              pendingAnimal && !pendingEmotion
                ? i / 2 + buttonHintDelay
                : undefined
            }
          >
            <img src={art.emotions[emotion]} />
          </Item>
        ))}
      </Grid>
    </Root>
  )
})

const Root = styled.div`
  animation: fadeIn 300ms ease-out forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  > :not(:last-child) {
    margin-bottom: ${rel(24)};
  }
`

const Prompt = styled.div`
  font-size: ${rel(28)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
`

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const Item = styled.div<{
  selected: boolean
  animateScaleWithDelay?: number
  invalid?: boolean
}>`
  width: ${rel(72)};
  height: ${rel(72)};
  background: white;
  border-radius: ${rel(24)};
  box-shadow: 0 ${rel(2)} 0 0 rgba(0, 0, 0, 0.25);
  margin: ${rel(8)};
  border: ${rel(4)} solid transparent;
  padding: ${rel(12 - 4)};
  transition: all 150ms ease-out;
  ${({ selected, invalid }) =>
    selected &&
    (invalid
      ? css`
          border-color: #e93643;
          background: #f27d7d;
        `
      : css`
          border-color: #5bb600;
        `)}

  > img {
    width: 100%;
    height: 100%;
  }

  ${({ animateScaleWithDelay }) =>
    animateScaleWithDelay !== undefined &&
    css`
      animation: buttonScale 0.5s ease-in-out ${animateScaleWithDelay}s forwards;
    `};
`
