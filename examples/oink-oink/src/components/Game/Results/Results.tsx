import { useAtomValue } from "jotai"
import {
  $players,
  $yourPlayerId,
  $round,
  $gameOver,
} from "../../../state/$state"
import { useState, useEffect, useMemo } from "react"
import { sortBy } from "../../../lib/sortBy"
import styled from "styled-components/macro"
import { rel } from "../../../style/rel"
import { AnimatedNumber } from "./AnimatedNumber"
import { ReadyButton } from "../../Start/Start"
import { numRounds } from "../../../logic"

const animationSteps = [
  { key: "empty", duration: 1000 },
  { key: "oldScores", duration: 750 },
  { key: "latestScore", duration: 250 },
  { key: "newScores", duration: 1000 },
  { key: "newScoreOrder", duration: 1000 },
  { key: "cta", duration: 0 },
] as const

const animationStepKeyIndexMap = animationSteps.reduce(
  (acc, step, i) => {
    acc[step.key] = i
    return acc
  },
  {} as {
    [K in (typeof animationSteps)[number]["key"]]: number
  }
)

export function Results() {
  const players = useAtomValue($players)
  const yourPlayerId = useAtomValue($yourPlayerId)
  const round = useAtomValue($round)
  const gameOver = useAtomValue($gameOver)

  const [animationStepIdx, setAnimationStepIdx] = useState(0)

  useEffect(() => {
    if (animationStepIdx === animationSteps.length - 1) return

    const handle = setTimeout(
      () => setAnimationStepIdx((step) => step + 1),
      animationSteps[animationStepIdx].duration
    )

    return () => clearTimeout(handle)
  }, [animationStepIdx])

  useEffect(() => {
    if (gameOver && animationStepIdx >= animationStepKeyIndexMap.cta) {
      Rune.showGameOverPopUp()
    }
  }, [animationStepIdx, gameOver])

  const playersOrderedByPrevious = useMemo(
    () =>
      sortBy(players, (player) => -(player.score - player.latestRoundScore)),
    [players]
  )

  const playersOrdered = useMemo(
    () => sortBy(players, (player) => -player.score),
    [players]
  )

  return (
    <Root>
      <Heading>Leaderboard</Heading>

      {animationStepIdx > animationStepKeyIndexMap.empty && (
        <List>
          {(round === 0 ||
          animationStepIdx >= animationStepKeyIndexMap.newScoreOrder
            ? playersOrdered
            : playersOrderedByPrevious
          ).map((player) => (
            <Item key={player.id}>
              <AvatarImg src={player.info.avatarUrl} />
              <div style={{ width: rel(8) }} />
              <Name>
                {player.id === yourPlayerId ? "You" : player.info.displayName}
              </Name>
              <div style={{ flex: 1 }} />
              <Score>
                {!!player.latestRoundScore &&
                  animationStepIdx >= animationStepKeyIndexMap.latestScore && (
                    <LatestScore>+{player.latestRoundScore}pt</LatestScore>
                  )}
                <AnimatedNumber
                  value={
                    animationStepIdx >= animationStepKeyIndexMap.newScores
                      ? player.score
                      : player.score - player.latestRoundScore
                  }
                />
                pts
              </Score>
            </Item>
          ))}
        </List>
      )}

      {animationStepIdx >= animationStepKeyIndexMap.cta &&
        yourPlayerId &&
        round < numRounds - 1 && (
          <ReadyButton visible onClick={() => Rune.actions.nextRound()}>
            <div>Continue</div>
          </ReadyButton>
        )}
    </Root>
  )
}

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: ${rel(47)};
  padding-bottom: max(env(safe-area-inset-bottom), ${rel(47)});
`

const Heading = styled.div`
  font-size: ${rel(40)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(16)};
  }
`

const Item = styled.div`
  width: ${rel(336)};
  background: white;
  border-radius: ${rel(24)};
  display: flex;
  align-items: center;
  padding: ${rel(16)} ${rel(29)} ${rel(16)} ${rel(24)};
`

const AvatarImg = styled.img`
  width: ${rel(32)};
  height: ${rel(32)};
`

const Name = styled.div`
  font-size: ${rel(24)};
  color: black;
`

const Score = styled.div`
  position: relative;
  font-size: ${rel(24)};
  color: #af41d1;
`

const LatestScore = styled.div`
  position: absolute;
  top: ${rel(-22)};
  right: ${rel(10)};

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
