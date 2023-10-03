import { useAtomValue } from "jotai"
import { $actorPlayer, $yourPlayerId } from "../../state/$state"
import styled from "styled-components/macro"
import { rel } from "../../style/rel"
import { Confetti } from "./CorrectGuess"
import confettiAnimation from "./lottie/confetti.json"
import { useEffect, memo } from "react"
import { sounds } from "../../sounds/sounds"
import { $currentTurn } from "../../state/$state"
import { art } from "./art/art"

export const EndOfTurn = memo(() => {
  const actorPlayer = useAtomValue($actorPlayer)
  const yourPlayerId = useAtomValue($yourPlayerId)
  const currentTurn = useAtomValue($currentTurn)

  useEffect(() => {
    sounds.endOfTurn.play()
  }, [])

  if (!currentTurn) return <></>

  const isActor = actorPlayer?.id === yourPlayerId
  const hasGuess = !!actorPlayer?.latestTurnScore.acting

  return (
    <Root>
      {isActor && hasGuess ? (
        <>
          <Confetti autoplay keepLastFrame src={confettiAnimation} />
          <Heading>Great job!</Heading>
          <div style={{ height: rel(58) }} />
          <Score>+{actorPlayer.latestTurnScore.acting}pt</Score>
          <Label>Points</Label>
        </>
      ) : isActor && !hasGuess ? (
        <Label>Better luck next time!</Label>
      ) : !isActor && hasGuess ? (
        <>
          <Label>The answer was...</Label>
          <GuessContainer>
            <EmotionImg src={art.emotions[currentTurn.emotion]} />
            <Plus>+</Plus>
            <AnimalImg src={art.animals[currentTurn.animal]} />
          </GuessContainer>
          <Label>{actorPlayer.info.displayName}</Label>
          <AvatarImg src={actorPlayer.info.avatarUrl} />
          <Score>+{actorPlayer.latestTurnScore.acting}pt</Score>
          <Label>Points</Label>
          <Label>For acting</Label>
        </>
      ) : (
        <>
          <Label>The answer was...</Label>
          <GuessContainer>
            <EmotionImg src={art.emotions[currentTurn.emotion]} />
            <Plus>+</Plus>
            <AnimalImg src={art.animals[currentTurn.animal]} />
          </GuessContainer>
          <Label>Better luck next time!</Label>
        </>
      )}
    </Root>
  )
})

const Root = styled.div`
  animation: fadeIn 300ms ease-out forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  > :not(:first-child) {
    margin-top: ${rel(5)};
  }
`

const Heading = styled.div`
  font-size: ${rel(64)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
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

const Label = styled.div`
  font-size: ${rel(28)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
`

const AvatarImg = styled.img`
  width: ${rel(94)};
  height: ${rel(94)};
`

const GuessContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: ${rel(38)};
  padding-bottom: ${rel(64)};
`

const EmotionImg = styled.img`
  width: ${rel(103)};
  height: ${rel(103)};
`

const Plus = styled.div`
  color: #e4faff;
  text-shadow: 0 ${rel(4.8)} 0 rgba(0, 0, 0, 0.35);
  font-size: ${rel(103)};
  margin: 0 ${rel(0)};
`

const AnimalImg = styled.img`
  width: ${rel(139)};
  height: ${rel(139)};
`
