import styled, { css } from "styled-components/macro"
import { rel } from "../../style/rel"
import { Color } from "../../lib/types/GameState"
import { useAtomValue } from "jotai"
import { $players, $yourPlayerId } from "../../state/$game"
import { $lastPlayerActivity } from "../../state/$lastPlayerActivity"
import { useState, useEffect, useRef, useMemo } from "react"
import { Direction } from "./types"

export function Label({
  playerId,
  color,
  x,
  y,
  direction,
  onSizeChanged,
}: {
  playerId: string
  color: Color
  x: number
  y: number
  direction: Direction
  onSizeChanged: (width: number, height: number) => void
}) {
  const players = useAtomValue($players)
  const yourPlayerId = useAtomValue($yourPlayerId)
  const displayName =
    playerId === yourPlayerId ? "You" : players?.[playerId]?.displayName
  const avatarUrl = players?.[playerId]?.avatarUrl
  const lastPlayerActivity = useAtomValue($lastPlayerActivity)[playerId]
  const [nameVisible, setNameVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setNameVisible(true)
    const handle = setTimeout(() => setNameVisible(false), 1000)
    return () => clearTimeout(handle)
  }, [lastPlayerActivity])

  const onSizeChangedRef = useRef(onSizeChanged)
  onSizeChangedRef.current = onSizeChanged

  useEffect(() => {
    const nameRect = ref.current?.querySelector("div")?.getBoundingClientRect()

    if (nameRect) {
      onSizeChangedRef.current(nameRect.width, nameRect.height)
      setWidth(nameRect.width)
    }
  }, [])

  const actualDirection = useMemo(() => {
    return direction === "right" && x + width > window.innerWidth
      ? "left"
      : direction === "left" && x - width < 0
      ? "right"
      : direction
  }, [direction, width, x])

  if (!displayName || !avatarUrl) return null

  return (
    <Root ref={ref} style={{ left: x, top: y }} bringToTop={nameVisible}>
      <Name
        visible={nameVisible}
        tint={color}
        direction={actualDirection}
        bold={playerId === yourPlayerId}
      >
        {displayName}
      </Name>
      <Avatar tint={color} src={avatarUrl} />
    </Root>
  )
}

const Root = styled.div<{ bringToTop: boolean }>`
  position: absolute;
  width: ${rel(22)};
  height: ${rel(22)};
  transform: translate(-50%, -50%);
  z-index: ${({ bringToTop }) => (bringToTop ? 1 : 0)};

  transition: all 0.2s ease-out;
`

const Avatar = styled.img<{ tint: Color }>`
  position: absolute;
  width: ${rel(22)};
  height: ${rel(22)};
  border-radius: 50%;
  border: ${rel(2)} solid ${({ tint }) => `rgb(${tint.join(", ")})`};
  background-color: ${({ tint }) => `rgb(${tint.join(", ")})`};
`

const Name = styled.div<{
  visible: boolean
  tint: Color
  direction: Direction
  bold: boolean
}>`
  position: absolute;
  ${({ direction }) =>
    direction === "right"
      ? css`
          left: 0;
          padding: ${rel(3)} ${rel(9)} ${rel(3)} ${rel(22 + 4)};
        `
      : css`
          right: 0;
          padding: ${rel(3)} ${rel(22 + 4)} ${rel(3)} ${rel(9)};
        `}
  top: ${rel(11)};
  white-space: nowrap;
  transform: translate(0, -50%);

  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  font-size: ${rel(9)};
  color: #eaf6d9;
  background-color: ${({ tint }) => `rgb(${tint.join(", ")})`};
  border-radius: ${rel(10)};

  transition: opacity 0.2s ease-in;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`
