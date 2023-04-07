import styled from "styled-components/macro"
import { Player } from "rune-games-sdk/multiplayer"

export function ScoreList({
  scores,
  myPlayerId,
  show,
  showLatestScore,
}: {
  scores: {
    player: Player
    score: number
    latestScore: number
    previousScore: number
  }[]
  myPlayerId: string | undefined
  show: "score" | "previousScore"
  showLatestScore: boolean
}) {
  return scores.length === 1 ? (
    <BigItem>
      <Avatar size="big" src={scores[0].player.avatarUrl} />
      <Name>
        {scores[0].player.playerId === myPlayerId
          ? "You"
          : scores[0].player.displayName}
      </Name>
      <Score>{scores[0][show]}</Score>
      {showLatestScore && (
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
          <Score>{item[show]}</Score>
          {showLatestScore && <LatestScore>+{item.latestScore}</LatestScore>}
        </Item>
      ))}
    </Items>
  )
}

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
