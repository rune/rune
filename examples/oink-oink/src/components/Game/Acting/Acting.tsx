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

  return (
    <Root>
      <Label>Make this sound!</Label>
      <div style={{ height: rel(8) }} />
      <SpeakingHead autoplay loop src={speakingAnimation} />
      <div style={{ height: rel(15) }} />
      <Carousel
        big
        values={animalImgs}
        selected={art.animals[currentTurn.animal]}
      />
      <div style={{ height: rel(48) }} />
      <Carousel
        values={emotionImgs}
        selected={art.emotions[currentTurn.emotion]}
      />
      <div style={{ height: rel(15) }} />
      <Label>Guesses</Label>
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
