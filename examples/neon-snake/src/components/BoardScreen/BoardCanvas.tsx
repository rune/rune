import "../../base.css"

import { boardSize } from "../../logic/logicConfig.ts"
import { styled } from "styled-components"
import { rel } from "../../lib/rel.ts"
import { gridBackground } from "../../lib/gridBackground.ts"
import { Stage, Container } from "@pixi/react"
import { useAtomValue } from "jotai/index"
import { $game, $players, $yourPlayerId } from "../../state/state.ts"

import { DrawPlayer } from "./DrawPlayer.tsx"

export function BoardCanvas({ scale }: { scale: number }) {
  const game = useAtomValue($game)
  const yourPlayerId = useAtomValue($yourPlayerId)
  const players = useAtomValue($players)
  return (
    <Root>
      <Stage
        width={boardSize.width * scale}
        height={boardSize.height * scale}
        options={{
          antialias: true,
          backgroundAlpha: 0,
        }}
      >
        <Container>
          {game.players.map((player) => (
            <DrawPlayer
              key={player.playerId}
              player={player}
              stage={game.stage}
              snake={game.snakes[player.playerId]}
              scale={scale}
              isOpponent={!!(yourPlayerId && yourPlayerId !== player.playerId)}
              avatar={players[player.playerId].avatarUrl}
              timerStartedAt={game.timerStartedAt}
            />
          ))}
        </Container>
      </Stage>
    </Root>
  )
}

const Root = styled.div`
  border: ${rel(3)} solid rgba(17, 212, 255, 0.5);
  ${gridBackground};
`
