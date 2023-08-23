import { art } from "../art/art"
import styled from "styled-components/macro"
import { rel } from "../../../style/rel"
import { useAtomValue } from "jotai"
import { $currentTurn } from "../../../state/$state"
import { Player } from "@lottiefiles/react-lottie-player"

import speakingAnimation from "../lottie/speaking.json"
import { RisingGuessesView } from "./RisingGuessesView"

export function Acting() {
  const currentTurn = useAtomValue($currentTurn)

  if (!currentTurn) return null

  return (
    <Root>
      <Prompt>Make this sound!</Prompt>
      <div style={{ height: rel(8) }} />
      <SpeakingHead autoplay loop src={speakingAnimation} />
      <div style={{ height: rel(15) }} />
      <AnimalImg src={art.animals[currentTurn.animal]} />
      <div style={{ height: rel(48) }} />
      <EmotionImg src={art.emotions[currentTurn.emotion]} />
      <div style={{ height: rel(15) }} />
      <Prompt>Guesses:</Prompt>
      <RisingGuessesView />
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Prompt = styled.div`
  font-size: ${rel(28)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
`

const AnimalImg = styled.img`
  width: ${rel(220)};
  height: ${rel(220)};
`

const EmotionImg = styled.img`
  width: ${rel(64)};
  height: ${rel(64)};
`

const SpeakingHead = styled(Player)`
  height: ${rel(37)};
`
