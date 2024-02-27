import React, { useMemo } from "react"
import styled from "styled-components/macro"
import { Overlay } from "../Overlay"
import mapImg from "./img/map.svg"
import { useAtomValue } from "jotai"
import { $game } from "../../state/game"
import { $players } from "../../state/players"
import {
  simpleCSSTransitionStyles,
  SimpleCSSTransition,
} from "../animation/SimpleCSSTransition"
import { timings } from "../animation/config"

export function StartOfRoundOverlay({ visible }: { visible: boolean }) {
  const game = useAtomValue($game)!
  const players = useAtomValue($players)!

  const round = game.currentRound
  const maxRound = game.rounds.length
  const playersArray = useMemo(() => Object.values(players), [players])

  return (
    <SimpleCSSTransition visible={visible} duration={timings.default}>
      <Root>
        <Box>
          <HeaderMapImg src={mapImg} />
          <Heading>Guess the Location!</Heading>
          <Label>
            Round {round + 1}/{maxRound}
          </Label>
          <PlayersContainer>
            {playersArray.map((player) => (
              <PlayerAvatarContainer key={player.playerId}>
                <PlayerAvatar src={player.avatarUrl} />
              </PlayerAvatarContainer>
            ))}
            {playersArray.length === 1 && (
              <Name>{playersArray[0].displayName}</Name>
            )}
          </PlayersContainer>
        </Box>
      </Root>
    </SimpleCSSTransition>
  )
}

const Root = styled(Overlay)`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  background: linear-gradient(
      0deg,
      rgba(1, 164, 145, 0.5),
      rgba(1, 164, 145, 0.5)
    ),
    rgba(216, 241, 232, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`

const Box = styled.div`
  position: relative;
  width: 90%;
  border-radius: 35px;
  background-color: white;
  padding: 44px 26px 20px 26px;
  color: #1e6252;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const HeaderMapImg = styled.img`
  position: absolute;
  top: -40px;
  width: 80px;
  height: 80px;
`

const Heading = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
`

const Label = styled.div`
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 14px;
  font-weight: 300;
`

const PlayersContainer = styled.div`
  background-color: #cff2e8;
  border-radius: 43px;
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 10px;
  }
`

const PlayerAvatarContainer = styled.div`
  display: flex;
`

const PlayerAvatar = styled.img`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 50%;
  max-width: 17vw;
  max-height: 17vw;
`

const Name = styled.div`
  font-size: 14px;
  font-weight: 300;
  padding: 0 10px 0 5px;
`
