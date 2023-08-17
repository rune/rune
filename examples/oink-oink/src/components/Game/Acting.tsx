import { art } from "./art/art"
import styled from "styled-components/macro"
import { rel } from "../../style/rel"
import { useAtomValue } from "jotai"
import { $currentTurn } from "../../state/$state"

export function Acting() {
  const currentTurn = useAtomValue($currentTurn)

  if (!currentTurn) return null

  return (
    <Root>
      <Prompt>Make this sound!</Prompt>
      <AnimalImg src={art.animals[currentTurn.animal]} />
      <EmotionImg src={art.emotions[currentTurn.emotion]} />
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
