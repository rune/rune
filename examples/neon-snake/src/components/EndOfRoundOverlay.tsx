import { useAtomValue } from "jotai"
import {
  $lastRoundWinnerId,
  $players,
  $yourPlayerId,
  $winnerColor,
} from "../state/state.ts"
import { styled } from "styled-components"
import { rel } from "../lib/rel.ts"
import { colors } from "../logic/logicConfig.ts"
import { useState, useEffect } from "react"
import {
  endOfRoundRevealDelayMs,
  defaultTransitionMs,
} from "./BoardScreen/drawConfig.ts"

const winnerString = "Winner"

export function EndOfRoundOverlay() {
  const lastRoundWinnerId = useAtomValue($lastRoundWinnerId)
  const players = useAtomValue($players)
  const yourPlayerId = useAtomValue($yourPlayerId)
  const winnerColor = useAtomValue($winnerColor)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handle = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  const winner = lastRoundWinnerId ? players[lastRoundWinnerId] : null

  if (!winner || !winnerColor) return null

  return (
    <Root style={{ opacity: visible ? 1 : 0 }}>
      <Box>
        <User>
          <Avatar src={winner.avatarUrl} $playerColor={winnerColor} />
          <Name $playerColor={winnerColor}>
            {winner.playerId === yourPlayerId ? "You" : winner.displayName}
          </Name>
        </User>
        <Winner>
          {winnerString.split("").map((letter, index) => (
            <span key={index} style={{ color: colors[index % colors.length] }}>
              {letter}
            </span>
          ))}
        </Winner>
        <Points>1 Point</Points>
      </Box>
    </Root>
  )
}

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity ${defaultTransitionMs}ms ${endOfRoundRevealDelayMs}ms
    ease-out;
`

const Box = styled.div`
  background-color: black;
  box-shadow: 0 0 ${rel(15)} ${rel(3)} #10d4ff;
  padding: ${rel(64)} ${rel(26)} ${rel(47)};
  border-radius: ${rel(16)};
  display: flex;
  flex-direction: column;
  align-items: center;

  > :not(:first-child) {
    margin-top: ${rel(15)};
  }
`

const User = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Avatar = styled.img<{ $playerColor: string }>`
  width: ${rel(72)};
  height: ${rel(72)};
  border-radius: 50%;
  border: ${rel(4)} solid ${({ $playerColor }) => $playerColor};
`

const Name = styled.div<{ $playerColor: string }>`
  font-size: ${rel(20)};
  padding: ${rel(4)} ${rel(10)};
  background-color: ${({ $playerColor }) => $playerColor};
  border-radius: ${rel(20)};
  margin-top: ${rel(-9)};
`

const Winner = styled.div`
  font-size: ${rel(56)};
  letter-spacing: ${rel(-2)};
  text-transform: uppercase;
`

const Points = styled.div`
  font-size: ${rel(20)};
  color: white;
  text-transform: uppercase;
`
