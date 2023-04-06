import React, { useMemo } from "react"
import styled from "styled-components/macro"
import { Overlay } from "../Overlay"
import mapImg from "./img/map.svg"
import { useAtomValue } from "jotai"
import { $game, $players } from "../../state/state"

export function StartOfRoundOverlay() {
  const game = useAtomValue($game)!
  const players = useAtomValue($players)!

  const round = game.currentRound
  const maxRound = game.rounds.length
  const playersArray = useMemo(() => Object.values(players), [players])

  return (
    <>
      <Background />
      <Content>
        <Root>
          <HeaderMapImg src={mapImg} />
          <Heading>Guess the Location!</Heading>
          <Label>
            Round {round + 1}/{maxRound}
          </Label>
          <PlayersContainer>
            {playersArray.map((player) => (
              <PlayerAvatar key={player.playerId} src={player.avatarUrl} />
            ))}
            {playersArray.length === 1 && (
              <Name>{playersArray[0].displayName}</Name>
            )}
          </PlayersContainer>
        </Root>
      </Content>
    </>
  )
}

const Background = styled(Overlay)`
  background: linear-gradient(0deg, #01a491, #01a491), #d8f1e8;
  opacity: 0.5;
`

const Content = styled(Overlay)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Root = styled.div`
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
`

const Label = styled.div`
  font-size: 14px;
  font-weight: 300;
  padding: 5px 0 15px;
`

const PlayersContainer = styled.div`
  background-color: #cff2e8;
  border-radius: 43px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 10px;
  }
`

const PlayerAvatar = styled.img`
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 25px;
`

const Name = styled.div`
  font-size: 14px;
  font-weight: 300;
  padding: 0 10px 0 5px;
`
