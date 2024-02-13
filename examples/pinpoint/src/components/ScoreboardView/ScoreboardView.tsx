import styled, { css } from "styled-components/macro"
import { OLMap, Pin } from "../OLMap/OLMap"
import React, { useMemo, useState, useEffect } from "react"
import { Overlay } from "../Overlay"
import greenCircleImg from "./img/greenCircle.svg"
import { CTA } from "../MapView/GuessingMapView"
import playIcon from "./img/play.svg"
import { pickBestGuessRepresentation } from "../../lib/pickBestGuessRepresentation"
import { useAtomValue } from "jotai"
import { $game, $guesses } from "../../state/game"
import { $players } from "../../state/players"
import { $myPlayerId } from "../../state/myPlayerId"
import { ScoreList } from "./ScoreList"
import {
  simpleCSSTransitionStyles,
  SimpleCSSTransition,
} from "../animation/SimpleCSSTransition"
import {
  timings,
  scoreboardAnimationStepTimings,
  ScoreboardAnimationStep,
} from "../animation/config"
import { sounds } from "../../sounds/sounds"
import { formatDistance } from "../../lib/formatDistance"
import backButtonImg from "../MapView/img/backButton.svg"
import forwardButtonImg from "../MapView/img/forwardButton.svg"
import { sortBy } from "../../lib/sortBy"
import { panoramasClient } from "../../lib/data/panoramasClient"

export function ScoreboardView() {
  const game = useAtomValue($game)!
  const players = useAtomValue($players)!
  const myPlayerId = useAtomValue($myPlayerId)

  const round = game.currentRound
  const panorama = panoramasClient[game.rounds[round].index]
  const guesses = useAtomValue($guesses)
  const isSpectator = !myPlayerId

  useEffect(() => {
    sounds.resultsMap.play()
  }, [])

  const pins = useMemo<Pin[]>(() => {
    const target = [panorama.longitude, panorama.latitude]

    return [
      ...guesses
        .filter((guess) => !guess.missed)
        .map((guess) => ({
          type: "guess" as const,
          location: pickBestGuessRepresentation(target, guess.location),
          confirmed: true,
          targetLocation: target,
          avatarUrl: players[guess.playerId].avatarUrl,
          distanceText: formatDistance(guess.distance),
        })),
      {
        type: "flag" as const,
        location: target,
      },
    ]
  }, [guesses, panorama.latitude, panorama.longitude, players])

  const scores = useMemo(
    () =>
      Object.values(players).map((player) => {
        const guesses = game.guesses.filter(
          (guess) => guess.playerId === player.playerId
        )
        const score = guesses.reduce((acc, guess) => acc + guess.score, 0)
        const latestScore = guesses.at(-1)?.score ?? 0
        const missed = !!guesses.at(-1)?.missed
        const previousScore = score - latestScore
        return {
          player,
          score,
          latestScore,
          previousScore,
          missed,
        }
      }),
    [game.guesses, players]
  )

  const scoresOrderedByPrevious = useMemo(
    () => sortBy(scores, (item) => -item.previousScore),
    [scores]
  )
  const scoresOrdered = useMemo(
    () => sortBy(scores, (item) => -item.score),
    [scores]
  )

  const [animationStep, setAnimationStep] = useState<ScoreboardAnimationStep>(0)

  useEffect(() => {
    if (animationStep === Object.values(ScoreboardAnimationStep).length / 2 - 1)
      return
    const handle = setTimeout(
      () => setAnimationStep((step) => step + 1),
      scoreboardAnimationStepTimings[animationStep]
    )
    return () => clearTimeout(handle)
  }, [animationStep])

  useEffect(() => {
    if (animationStep === ScoreboardAnimationStep.newScores) {
      sounds.scoreIncrease.play()
    }
  }, [animationStep])

  const [overlayHidden, setOverlayHidden] = useState(false)

  return (
    <Root>
      <OLMap center={[0, 0]} zoom={0} pins={pins} autoFitPins />
      <SimpleCSSTransition
        visible={
          animationStep >= ScoreboardAnimationStep.background && !overlayHidden
        }
        duration={timings.default}
      >
        <ContentRoot>
          <WhiteBackground />
          <GreenCircle src={greenCircleImg} />
          <Content>
            <Header>Scoreboard</Header>
            <Subheader>
              Round {round + 1}/{game.rounds.length}
            </Subheader>

            <SimpleCSSTransition
              visible={animationStep >= ScoreboardAnimationStep.oldScores}
              duration={timings.default}
            >
              <ListContainer>
                <ScoreList
                  scores={
                    animationStep >= ScoreboardAnimationStep.newScoreOrder ||
                    round === 0
                      ? scoresOrdered
                      : scoresOrderedByPrevious
                  }
                  myPlayerId={myPlayerId}
                  show={
                    animationStep >= ScoreboardAnimationStep.newScores
                      ? "score"
                      : "previousScore"
                  }
                  showLatestScore={
                    animationStep >= ScoreboardAnimationStep.latestScore
                  }
                />
              </ListContainer>
              <Photographer>Photo by {panorama.authorName}</Photographer>
            </SimpleCSSTransition>

            <SimpleCSSTransition
              visible={
                animationStep >= ScoreboardAnimationStep.cta &&
                !isSpectator &&
                round < game.rounds.length - 1
              }
              duration={timings.default}
            >
              <BottomContainer>
                <CTA onClick={() => Rune.actions.nextRound()}>
                  <PlayIcon src={playIcon} />
                  <span>Next Round</span>
                </CTA>
                {Object.keys(players).length < 6 && (
                  <InviteLink onClick={() => Rune.showInvitePlayers()}>
                    Invite more friends!
                  </InviteLink>
                )}
              </BottomContainer>
            </SimpleCSSTransition>
          </Content>
        </ContentRoot>
      </SimpleCSSTransition>

      {animationStep >= ScoreboardAnimationStep.background &&
        (overlayHidden ? (
          <MapToggleButton
            src={forwardButtonImg}
            position="right"
            onClick={() => setOverlayHidden(false)}
          />
        ) : (
          <MapToggleButton
            src={backButtonImg}
            position="left"
            onClick={() => setOverlayHidden(true)}
          />
        ))}
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`

const ContentRoot = styled.div`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
`

const ListContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${simpleCSSTransitionStyles({ right: "-100%" }, { right: 0 })};
`

const WhiteBackground = styled(Overlay)`
  background-color: #f8fffc;
  opacity: 0.9;
`

const GreenCircle = styled.img`
  width: 124vw;
  height: 124vw;
  position: absolute;
  top: -50vw;
  left: -12vw;
`

const Content = styled(Overlay)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #f8fffc;
  padding-top: 35px;
`

const Subheader = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #f8fffc;
  padding-bottom: 30px;
`

const BottomContainer = styled.div`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 40px;
  align-items: center;
  > :not(:first-child) {
    margin-top: 25px;
  }
`

const PlayIcon = styled.img`
  width: 14px;
`

const InviteLink = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #01a491;
  pointer-events: auto;
`

const MapToggleButton = styled.img<{ position: "left" | "right" }>`
  position: absolute;
  top: 15px;
  ${({ position }) =>
    position === "left"
      ? css`
          left: 10px;
        `
      : css`
          right: 10px;
        `};
  width: 33px;
  height: 33px;
`

const Photographer = styled.p`
  margin: 10px;
  font-size: 13px;
  font-weight: 300;
  color: #01a491;
`
