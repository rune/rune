import { useAtomValue } from "jotai"
import { $timer } from "../state/state.ts"
import { styled } from "styled-components"
import { rel } from "../lib/rel.ts"
import { colors, countdownDuration } from "../logic/logicConfig.ts"

export function CountdownOverlay() {
  const timer = useAtomValue($timer)

  const color = colors[(countdownDuration - timer) % 4]

  return <Root $color={color}>{timer}</Root>
}

const Root = styled.div<{ $color: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${rel(300)};
  letter-spacing: ${rel(-6)};

  color: ${({ $color }) => $color};
  text-shadow: 0 0 ${rel(15)} ${({ $color }) => $color};
  transition:
    color 0.4s ease-out,
    text-shadow 0.4s ease-out;
`
