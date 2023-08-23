import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { animals, emotions, Animal, Emotion } from "../../lib/types/GameState"
import { art } from "./art/art"
import { useState, useEffect } from "react"

export function Guessing() {
  const [pendingAnimal, setPendingAnimal] = useState<Animal>()
  const [pendingEmotion, setPendingEmotion] = useState<Emotion>()

  useEffect(() => {
    if (pendingAnimal && pendingEmotion) {
      // todo: figure out if there's an easy way to add a lag without delaying submit
      const handle = setTimeout(() => {
        Rune.actions.makeGuess({
          animal: pendingAnimal,
          emotion: pendingEmotion,
        })
        setPendingAnimal(undefined)
        setPendingEmotion(undefined)
      }, 500)
      return () => clearTimeout(handle)
    }
  }, [pendingAnimal, pendingEmotion])

  return (
    <Root>
      <Prompt>Guess the animal</Prompt>
      <Grid>
        {animals.map((animal, i) => (
          <Item
            key={animal}
            selected={pendingAnimal === animal}
            onClick={() => setPendingAnimal(animal)}
            animateScaleWithDelay={
              pendingEmotion && !pendingAnimal ? i / 2 : undefined
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
            onClick={() => setPendingEmotion(emotion)}
            animateScaleWithDelay={
              pendingAnimal && !pendingEmotion ? i / 2 : undefined
            }
          >
            <img src={art.emotions[emotion]} />
          </Item>
        ))}
      </Grid>
    </Root>
  )
}

const Root = styled.div`
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

const Item = styled.div<{ selected: boolean; animateScaleWithDelay?: number }>`
  width: ${rel(72)};
  height: ${rel(72)};
  background: white;
  border-radius: ${rel(24)};
  box-shadow: 0 ${rel(2)} 0 0 rgba(0, 0, 0, 0.25);
  margin: ${rel(8)};
  border: ${rel(4)} solid transparent;
  padding: ${rel(12 - 4)};
  ${({ selected }) =>
    selected &&
    css`
      border-color: #5bb600;
    `}

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
