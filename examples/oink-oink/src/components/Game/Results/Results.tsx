import { useAtomValue } from "jotai"
import {
  $players,
  $yourPlayerId,
  $round,
  $gameOver,
} from "../../../state/$state"
import { useState, useEffect, useMemo, memo } from "react"
import { sortBy } from "../../../lib/sortBy"
import styled, { css } from "styled-components/macro"
import { rel } from "../../../style/rel"
import { AnimatedNumber } from "./AnimatedNumber"
import { ReadyButton } from "../../Start/Start"
import { numRounds } from "../../../logic"
import { sounds } from "../../../sounds/sounds"
import speaking from "./speaking.svg"
import checkmark from "./checkmark.svg"

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

const itemHeight = 50
const itemGap = 16
const scoreGap = 4

export const Results = memo(() => {
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
      sortBy(players, (player) => {
        const score = player.score.acting + player.score.guessing
        const latestRoundScore =
          player.latestRoundScore.acting + player.latestRoundScore.guessing

        return -(score - latestRoundScore)
      }),
    [players]
  )

  const playersOrderedByScore = useMemo(
    () =>
      sortBy(players, (player) => {
        const score = player.score.acting + player.score.guessing
        return -score
      }),
    [players]
  )

  const playersFixedOrderWithOffset = useMemo(
    () =>
      sortBy(
        players,
        (player) => {
          const score = player.score.acting + player.score.guessing
          const latestRoundScore =
            player.latestRoundScore.acting + player.latestRoundScore.guessing

          return -(score - latestRoundScore)
        },
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
      <Header>
        <Heading>Leaderboard</Heading>
        <SubHeading>
          Round {round + 1}/{numRounds}
        </SubHeading>
      </Header>

      <List
        style={{
          opacity: animationStepIdx > animationStepKeyIndexMap.empty ? 1 : 0,
        }}
      >
        <HeaderItem>
          <div style={{ flex: 1 }} />
          <HeaderScore>
            <SpeakingImg src={speaking} />
          </HeaderScore>
          <div style={{ width: rel(scoreGap) }} />
          <HeaderScore>
            <CheckmarkImg src={checkmark} />
          </HeaderScore>
          <div style={{ width: rel(scoreGap) }} />
          <HeaderTotalScore>Total</HeaderTotalScore>
        </HeaderItem>
        {playersFixedOrderWithOffset.map((player) => {
          const latestRoundScore =
            player.latestRoundScore.acting + player.latestRoundScore.guessing
          const score = player.score.acting + player.score.guessing

          return (
            <Item key={player.id} offset={player.offset}>
              <AvatarImg src={player.info.avatarUrl} />
              <div style={{ width: rel(8) }} />
              <Name>
                {player.id === yourPlayerId ? "You" : player.info.displayName}
              </Name>
              <div style={{ flex: 1 }} />
              <Score>{player.score.acting}</Score>
              <div style={{ width: rel(scoreGap) }} />
              <Score>{player.score.guessing}</Score>
              <div style={{ width: rel(scoreGap) }} />
              <TotalScore>
                <ScoreBadge>
                  <LatestScore
                    style={{
                      opacity:
                        !!latestRoundScore &&
                        animationStepIdx >= animationStepKeyIndexMap.latestScore
                          ? 1
                          : 0,
                    }}
                  >
                    +{latestRoundScore}pt
                  </LatestScore>
                  <AnimatedNumber
                    value={
                      animationStepIdx >= animationStepKeyIndexMap.newScores
                        ? score
                        : score - latestRoundScore
                    }
                  />
                  pts
                </ScoreBadge>
              </TotalScore>
            </Item>
          )
        })}
      </List>

      <ReadyButton
        style={{
          opacity:
            animationStepIdx >= animationStepKeyIndexMap.cta &&
            yourPlayerId &&
            round < numRounds - 1
              ? 1
              : 0,
        }}
        onClick={() => Rune.actions.nextRound()}
      >
        <div>Continue</div>
      </ReadyButton>
    </Root>
  )
})

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

const Header = styled.div``

const Heading = styled.div`
  font-size: ${rel(40)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
  text-align: center;
`

const SubHeading = styled(Heading)`
  padding-top: ${rel(10)};
  font-size: ${rel(28)};
`

const List = styled.div`
  transition: opacity 300ms ease-out;
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(itemGap)};
  }
`

const itemLayoutCss = css`
  width: ${rel(336)};
  padding: ${rel(9)} ${rel(16)};
  display: flex;
  align-items: center;
`

const scoreLayoutCss = css`
  flex-shrink: 0;
  width: ${rel(47)};
  text-align: center;
`

const totalScoreLayoutCss = css`
  flex-shrink: 0;
  width: ${rel(55 + 16)};
  text-align: center;
  margin-right: ${rel(-8)};
`

const HeaderItem = styled.div`
  ${itemLayoutCss}
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: ${rel(-1.5)};
`

const SpeakingImg = styled.img`
  width: ${rel(30)};
`

const CheckmarkImg = styled.img`
  width: ${rel(26)};
`

const HeaderScore = styled.div`
  ${scoreLayoutCss}
`

const HeaderTotalScore = styled.div`
  ${totalScoreLayoutCss}
  color: #e4faff;
  font-size: ${rel(16)};
`

const Item = styled.div<{ offset: string }>`
  ${itemLayoutCss}
  background: white;
  border-radius: ${rel(24)};
  height: ${rel(itemHeight)};
  position: relative;
  top: ${({ offset }) => offset};
  transition: top 500ms ease-in-out;
`

const AvatarImg = styled.img`
  width: ${rel(32)};
  height: ${rel(32)};
`

const Name = styled.div`
  font-size: ${rel(16)};
  color: black;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Score = styled.div`
  ${scoreLayoutCss}
  font-size: ${rel(16)};
  color: #ffbccb;
`
const TotalScore = styled.div`
  ${totalScoreLayoutCss}
  font-size: ${rel(16)};
  color: #ffffff;
`
const ScoreBadge = styled.div`
  position: relative;
  display: inline-block;

  background-color: #af41d1;

  padding: ${rel(4)} ${rel(8)};
  border-radius: ${rel(13)};
`

const LatestScore = styled.div`
  transition: opacity 300ms ease-out;

  position: absolute;
  top: ${rel(-28)};
  right: 0;

  background: #23490c;
  -webkit-background-clip: text;
  -webkit-text-stroke: ${rel(2)} transparent;
  background-clip: text;
  text-stroke: ${rel(2)} transparent;
  // this is needed for the stroke renders nicely
  padding: ${rel(1)};
  letter-spacing: ${rel(0.5)};

  font-size: ${rel(24)};
  color: #69c251;
  text-shadow: 0 ${rel(4.5)} ${rel(4.5)} rgba(0, 0, 0, 0.25);
`
