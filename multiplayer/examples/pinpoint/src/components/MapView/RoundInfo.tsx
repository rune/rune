import styled from "styled-components/macro"
import React, { useMemo } from "react"
import invitePlayerImg from "./img/invitePlayer.svg"
import avatarCheckmarkImg from "./img/avatarCheckmark.svg"
import { useAtomValue } from "jotai"
import { $game, $guesses } from "../../state/game"
import { $players, $myPlayer } from "../../state/players"
import { $myPlayerId } from "../../state/myPlayerId"
import {
  simpleCSSTransitionStyles,
  SimpleCSSTransition,
} from "../animation/SimpleCSSTransition"
import { timings } from "../animation/config"

export function RoundInfo() {
  const game = useAtomValue($game)!
  const players = useAtomValue($players)!
  const myPlayerId = useAtomValue($myPlayerId)

  const round = game.currentRound
  const guesses = useAtomValue($guesses)
  const myPlayer = useAtomValue($myPlayer)
  const remainingPlayers = useMemo(
    () =>
      Object.values(players).filter(({ playerId }) => playerId !== myPlayerId),
    [players, myPlayerId]
  )

  if (!myPlayer) return null

  return (
    <Root>
      <Header>
        Round {round + 1}/{game.rounds.length}
      </Header>
      <Players>
        <Player>
          <AvatarContainer>
            <Avatar src={myPlayer.avatarUrl} />
            <SimpleCSSTransition
              visible={!!guesses.find((guess) => guess.playerId === myPlayerId)}
              duration={timings.default}
            >
              <AvatarCheckmarkContainer>
                <AvatarCheckmark src={avatarCheckmarkImg} />
              </AvatarCheckmarkContainer>
            </SimpleCSSTransition>
          </AvatarContainer>
          <Name>You</Name>
        </Player>
        {remainingPlayers.map((player) => (
          <Player key={player.playerId}>
            <AvatarContainer>
              <Avatar src={player.avatarUrl} />
              <SimpleCSSTransition
                visible={
                  !!guesses.find((guess) => guess.playerId === player.playerId)
                }
                duration={timings.default}
              >
                <AvatarCheckmarkContainer>
                  <AvatarCheckmark src={avatarCheckmarkImg} />
                </AvatarCheckmarkContainer>
              </SimpleCSSTransition>
            </AvatarContainer>
            <Name>{player.displayName}</Name>
          </Player>
        ))}
        {remainingPlayers.length < 3 && (
          <Player onClick={() => Rune.showInvitePlayers()}>
            <AvatarPlaceholder src={invitePlayerImg} />
            <Name>Invite</Name>
          </Player>
        )}
      </Players>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #d8f1e8;
  padding-bottom: min(env(safe-area-inset-bottom), 10px);
`

const Header = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #d8f1e8;
  background-color: #01a491;
  padding: 2px 0;
  display: flex;
  justify-content: center;
`

const Players = styled.div`
  display: flex;
  padding: 10px 2vw 5px;
`

const Player = styled.div`
  width: 24vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Avatar = styled.img`
  width: 17vw;
  height: 17vw;
  border: 1px solid #d8f1e8;
  border-radius: 17vw;
`

const AvatarContainer = styled.div`
  background: linear-gradient(180deg, #01a491 0%, #a7e4d5 147.12%);
  border-radius: 17vw;
  display: flex;
  padding: 1px;
  position: relative;
`

const AvatarPlaceholder = styled.img`
  width: calc(17vw + 2px);
  height: calc(17vw + 2px);
`

const AvatarCheckmarkContainer = styled.div`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  position: absolute;
  width: 17vw;
  height: 17vw;
  border: 1px solid #d8f1e8;
  background-color: rgba(30, 98, 82, 0.5);
  border-radius: 17vw;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AvatarCheckmark = styled.img`
  width: 14vw;
`

const Name = styled.div`
  color: #01a491;
  font-size: 10px;
  font-weight: 400;
  padding: 0 5px;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
