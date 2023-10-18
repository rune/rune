import "../../base.css"

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import { boardSize } from "../../logic/logic.ts"
import { styled } from "styled-components"
import { drawBoard } from "./drawBoard.ts"

// TODO: show avatars during countdown stage

export function BoardCanvas({
  containerWidth,
  containerHeight,
}: {
  containerWidth: number
  containerHeight: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function calculateScale() {
      const widthScale = containerWidth / boardSize.width
      const heightScale = containerHeight / boardSize.height

      const newScale = Math.min(widthScale, heightScale)

      setScale(newScale > 0 ? newScale : 1)
    }

    calculateScale()

    window.addEventListener("resize", calculateScale)

    return () => window.removeEventListener("resize", calculateScale)
  }, [containerHeight, containerWidth])

  useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined

    function tick() {
      if (canvasRef.current) {
        drawBoard(canvasRef.current, scale * window.devicePixelRatio)
      }

      handle = requestAnimationFrame(tick)
    }

    handle = requestAnimationFrame(tick)

    return () => {
      if (handle) cancelAnimationFrame(handle)
    }
  }, [scale])

  const canvasSizeStyle = useMemo<CSSProperties>(
    () => ({
      width: boardSize.width * scale,
      height: boardSize.height * scale,
    }),
    [scale],
  )

  return (
    <Root
      ref={canvasRef}
      width={boardSize.width * scale * window.devicePixelRatio}
      height={boardSize.height * scale * window.devicePixelRatio}
      style={canvasSizeStyle}
    />
  )
}

const Root = styled.canvas`
  background: black;
`
