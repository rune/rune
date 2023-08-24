import { useAtomValue } from "jotai"
import {
  $players,
  $yourPlayerId,
  $round,
  $gameOver,
} from "../../../state/$state"
import { useState, useEffect, useMemo } from "react"
import { sortBy } from "../../../lib/sortBy"
import styled, { css } from "styled-components/macro"
import { rel } from "../../../style/rel"
import { AnimatedNumber } from "./AnimatedNumber"
import { ReadyButton } from "../../Start/Start"
import { numRounds } from "../../../logic"
import { sounds } from "../../../sounds/sounds"

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

const itemHeight = 64
const itemGap = 16

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
    if (animationStepIdx === animationStepKeyIndexMap.newScores) {
      sounds.scoreIncrease.play()
    }
  }, [animationStepIdx])

  useEffect(() => {
    if (gameOver && animationStepIdx >= animationStepKeyIndexMap.cta) {
      Rune.showGameOverPopUp()
    }
  }, [animationStepIdx, gameOver])

  const playersOrderedByPreviousScore = useMemo(
    () =>
      sortBy(players, (player) => -(player.score - player.latestRoundScore)),
    [players]
  )

  const playersOrderedByScore = useMemo(
    () => sortBy(players, (player) => -player.score),
    [players]
  )

  const playersFixedOrderWithOffset = useMemo(
    () =>
      sortBy(
        players,
        (player) => -(player.score - player.latestRoundScore),
        (player) => player.id
      ).map((player, i) => ({
        ...player,
        offset: rel(
          ((round === 0 ||
          animationStepIdx >= animationStepKeyIndexMap.newScoreOrder
            ? playersOrderedByScore
            : playersOrderedByPreviousScore
          ).indexOf(player) -
            i) *
            (itemHeight + itemGap)
        ),
      })),
    [
      animationStepIdx,
      players,
      playersOrderedByPreviousScore,
      playersOrderedByScore,
      round,
    ]
  )

  return (
    <Root>
      <Heading>Leaderboard</Heading>

      <List invisible={!(animationStepIdx > animationStepKeyIndexMap.empty)}>
        {playersFixedOrderWithOffset.map((player) => (
          <Item key={player.id} offset={player.offset}>
            <AvatarImg src={player.info.avatarUrl} />
            <div style={{ width: rel(8) }} />
            <Name>
              {player.id === yourPlayerId ? "You" : player.info.displayName}
            </Name>
            <div style={{ flex: 1 }} />
            <Score>
              <LatestScore
                invisible={
                  !(
                    !!player.latestRoundScore &&
                    animationStepIdx >= animationStepKeyIndexMap.latestScore
                  )
                }
              >
                +{player.latestRoundScore}pt
              </LatestScore>
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

      <ReadyButton
        invisible={
          !(
            animationStepIdx >= animationStepKeyIndexMap.cta &&
            yourPlayerId &&
            round < numRounds - 1
          )
        }
        onClick={() => Rune.actions.nextRound()}
      >
        <div>Continue</div>
      </ReadyButton>
    </Root>
  )
}

const Root = styled.div`
  animation: fadeIn 300ms ease-out forwards;
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

const List = styled.div<{ invisible: boolean }>`
  ${({ invisible }) =>
    invisible
      ? css`
          opacity: 0;
        `
      : css`
          opacity: 1;
        `};
  transition: opacity 300ms ease-out;
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(itemGap)};
  }
`

const Item = styled.div<{ offset: string }>`
  width: ${rel(336)};
  background: white;
  border-radius: ${rel(24)};
  display: flex;
  align-items: center;
  height: ${rel(itemHeight)};
  padding: 0 ${rel(29)} 0 ${rel(24)};
  position: relative;
  top: ${({ offset }) => offset};
  transition: top 500ms ease-in-out;
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

const LatestScore = styled.div<{ invisible?: boolean }>`
  ${({ invisible }) =>
    invisible
      ? css`
          opacity: 0;
        `
      : css`
          opacity: 1;
        `};
  transition: opacity 300ms ease-out;

  position: absolute;
  top: ${rel(-22)};
  right: 0;

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
