import { art } from "../art/art"
import styled from "styled-components/macro"
import { rel } from "../../../style/rel"
import { useAtomValue } from "jotai"
import { $currentTurn, $animals, $emotions } from "../../../state/$state"
import { Player } from "@lottiefiles/react-lottie-player"

import speakingAnimation from "../lottie/speaking.json"
import { RisingGuessesView } from "./RisingGuessesView"
import { Carousel } from "./Carousel"
import { useMemo, memo } from "react"

export const Acting = memo(() => {
  const currentTurn = useAtomValue($currentTurn)
  const animals = useAtomValue($animals)
  const emotions = useAtomValue($emotions)

  const animalImgs = useMemo(
    () => animals.map((animal) => art.animals[animal]),
    [animals]
  )
  const emotionImgs = useMemo(
    () => emotions.map((emotion) => art.emotions[emotion]),
    [emotions]
  )

  if (!currentTurn) return null

  const selectedAnimal = art.animals[currentTurn.animal]
  const selectedEmoji = art.emotions[currentTurn.emotion]

  return (
    <Root>
      <Label>Make this sound!</Label>
      <div style={{ height: rel(8) }} />
      <SpeakingHead autoplay loop src={speakingAnimation} />
      <div style={{ height: rel(15) }} />
      <Carousel
        big
        values={animalImgs}
        selected={selectedAnimal}
        key={selectedAnimal}
      />
      <div style={{ height: rel(15) }} />
      <Carousel
        values={emotionImgs}
        selected={selectedEmoji}
        key={selectedEmoji}
      />
      <div style={{ height: rel(15) }} />
      <SkipGuessButton
        style={{ opacity: currentTurn.showSkipGuessButton ? 1 : 0 }}
        onClick={() => Rune.actions.skipGuess()}
      >
        Skip
      </SkipGuessButton>
      <div style={{ height: rel(15) }} />
      <Label>Guesses</Label>
      <div style={{ height: rel(15) }} />
      <RisingGuessesView />
    </Root>
  )
})

const Root = styled.div`
  animation: fadeIn 300ms ease-out forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Label = styled.div`
  font-size: ${rel(28)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
`

const SpeakingHead = styled(Player)`
  height: ${rel(37)};
`

const SkipGuessButton = styled.div`
  width: ${rel(168)};
  transition: opacity 150ms ease-out;

  background: #280a3d;
  border-radius: ${rel(12)};
  border: ${rel(2)} solid #6c1c92;
  padding: ${rel(8)};

  font-size: ${rel(24)};
  color: #8539ba;
  text-align: center;
`
