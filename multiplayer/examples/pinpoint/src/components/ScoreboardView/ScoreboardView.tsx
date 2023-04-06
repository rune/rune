import styled from "styled-components/macro"
import { OLMap, Pin } from "../OLMap/OLMap"
import { useMemo, useState, useEffect } from "react"
import { Overlay } from "../Overlay"
import greenCircleImg from "./img/greenCircle.svg"
import sortBy from "lodash/sortBy"
import { CTA } from "../MapView/GuessingMapView"
import playIcon from "./img/play.svg"
import { Rune } from "../../lib/Rune"
import { pickBestGuessRepresentation } from "../../lib/pickBestGuessRepresentation"
import { useAtomValue } from "jotai"
import { $game } from "../../state/game"
import { $players } from "../../state/players"
import { $myPlayerId } from "../../state/myPlayerId"

export function ScoreboardView() {
  const game = useAtomValue($game)!
  const players = useAtomValue($players)!
  const myPlayerId = useAtomValue($myPlayerId)

  const round = game.currentRound
  const panorama = game.rounds[round].panorama
  const guesses = useMemo(
    () => game.guesses.filter((guess) => guess.round === round),
    [round, game.guesses]
  )
  const isSpectator = !myPlayerId

  const pins = useMemo<Pin[]>(() => {
    const target = [panorama.longitude, panorama.latitude]

    return [
      {
        type: "flag" as const,
        location: target,
      },
      ...guesses.map((guess) => ({
        type: "guess" as const,
        location: pickBestGuessRepresentation(target, guess.location),
        targetLocation: target,
        avatarUrl: players[guess.playerId].avatarUrl,
        distanceText: `${Math.round(guess.distance)}km`,
      })),
    ]
  }, [guesses, panorama.latitude, panorama.longitude, players])

  const scores = useMemo(
    () =>
      sortBy(
        Object.values(players).map((player) => {
          const guesses = game.guesses.filter(
            (guess) => guess.playerId === player.playerId
          )
          return {
            player,
            score: guesses.reduce((acc, guess) => acc + guess.score, 0),
            latestScore: guesses.at(-1)?.score ?? 0,
          }
        }),
        (item) => -item.score
      ),
    [game.guesses, players]
  )

  const [scoreboardShown, setScoreboardShown] = useState(false)

  useEffect(() => {
    const handle = setTimeout(() => setScoreboardShown(true), 2000)
    return () => clearTimeout(handle)
  }, [])

  return (
    <Root>
      <OLMap center={[0, 0]} zoom={0} pins={pins} autoFitPins />
      {scoreboardShown && (
        <>
          <WhiteBackground />
          <GreenCircle src={greenCircleImg} />
          <Content>
            <Header>Scoreboard</Header>
            <Subheader>
              Round {round + 1}/{game.rounds.length}
            </Subheader>
            {scores.length === 1 ? (
              <BigItem>
                <Avatar size="big" src={scores[0].player.avatarUrl} />
                <Name>
                  {scores[0].player.playerId === myPlayerId
                    ? "You"
                    : scores[0].player.displayName}
                </Name>
                <Score>{scores[0].score}</Score>
                {round > 0 && (
                  <LatestScoreRight>+{scores[0].latestScore}</LatestScoreRight>
                )}
              </BigItem>
            ) : (
              <Items>
                {scores.map((item) => (
                  <Item key={item.player.playerId}>
                    <Avatar size="small" src={item.player.avatarUrl} />
                    <Name>
                      {item.player.playerId === myPlayerId
                        ? "You"
                        : item.player.displayName}
                    </Name>
                    <Score>{item.score}</Score>
                    {round > 0 && (
                      <LatestScore>+{item.latestScore}</LatestScore>
                    )}
                  </Item>
                ))}
              </Items>
            )}
            {!isSpectator && round < game.rounds.length - 1 && (
              <BottomContainer>
                <CTA onClick={() => Rune.actions.nextRound()}>
                  <PlayIcon src={playIcon} />
                  <span>Next Round</span>
                </CTA>
                <InviteLink onClick={() => Rune.showInvitePlayers()}>
                  Invite more friends!
                </InviteLink>
              </BottomContainer>
            )}
          </Content>
        </>
      )}
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`

const WhiteBackground = styled(Overlay)`
  background-color: white;
  opacity: 0.8;
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

const BigItem = styled.div`
  background: linear-gradient(0deg, #d8f1e8, #d8f1e8), #d2d2d2;
  border-radius: 15px;
  padding: 23px 34px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  > :not(:first-child) {
    margin-top: 10px;
  }
  width: 190px;
`

const Items = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  > :not(:first-child) {
    margin-top: 10px;
  }
`

const Item = styled.div`
  background: linear-gradient(0deg, #d8f1e8, #d8f1e8), #d2d2d2;
  border-radius: 15px;
  padding: 10px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  position: relative;
`

const Avatar = styled.img<{ size: "big" | "small" }>`
  width: ${({ size }) => (size === "big" ? 70 : 50)}px;
  height: ${({ size }) => (size === "big" ? 70 : 50)}px;
`

const Name = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #01a491;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 20px;
`

const Score = styled.div`
  background-color: #01a491;
  font-size: 13px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 45px;
  color: #f8fffc;
  width: 55px;
  text-align: center;
`

const LatestScore = styled.div`
  color: #1e6252;
  font-size: 13px;
  font-weight: 700;
  position: absolute;
  right: 35px;
  top: 2px;
`

const LatestScoreRight = styled(LatestScore)`
  top: inherit;
  bottom: 25px;
  right: 25px;
`

const BottomContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
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
`
