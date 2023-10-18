import { styled } from "styled-components"
import { useAtomValue } from "jotai"
import { $game, $players, $yourPlayerId } from "../state/state.ts"
import { rel } from "../lib/rel.ts"

export function Header() {
  // TODO: think how to avoid re-rendering on every tick because we use the full game state
  const game = useAtomValue($game)
  const players = useAtomValue($players)
  const yourPlayerId = useAtomValue($yourPlayerId)

  return (
    <Root>
      {Object.values(game.players).map(({ playerId, color, score, state }) => (
        <PlayerContainer key={playerId}>
          {state === "pending" ? (
            <div style={{ color: "white" }}>pending</div>
          ) : state === "dead" ? (
            <div style={{ color: "white" }}>dead</div>
          ) : (
            <Avatar src={players[playerId].avatarUrl} $playerColor={color} />
          )}
          <Name $playerColor={color}>
            {playerId === yourPlayerId ? "You" : players[playerId].displayName}
          </Name>
          <Score $playerColor={color}>{score}</Score>
        </PlayerContainer>
      ))}
    </Root>
  )
}

const Root = styled.div`
  height: ${rel(80)};
  background: black;
  display: flex;
  align-items: center;
`

const PlayerContainer = styled.div`
  width: 25vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Avatar = styled.img<{ $playerColor: string }>`
  width: ${rel(32)};
  height: ${rel(32)};
  border-radius: 50%;
  border: ${rel(2)} solid ${({ $playerColor }) => $playerColor};
  box-shadow: 0 0 ${rel(15)} ${rel(3)} ${({ $playerColor }) => $playerColor};
`

const Name = styled.div<{ $playerColor: string }>`
  background-color: ${({ $playerColor }) => $playerColor};
  position: relative;
  top: ${rel(-4)};
  padding: ${rel(2)} ${rel(4)};
  border-radius: ${rel(14)};
  box-shadow: 0 0 ${rel(15)} ${rel(3)} ${({ $playerColor }) => $playerColor};

  font-family: Arial Rounded MT Bold;
  font-size: ${rel(9)};
  line-height: normal;
`

const Score = styled.div<{ $playerColor: string }>`
  color: ${({ $playerColor }) => $playerColor};
  text-shadow: 0 0 ${rel(15)} ${({ $playerColor }) => $playerColor};

  font-family: Arial Rounded MT Bold;
  font-size: ${rel(24)};
  height: ${rel(21)};
  line-height: ${rel(21)}; // TODO: this is not right
`
