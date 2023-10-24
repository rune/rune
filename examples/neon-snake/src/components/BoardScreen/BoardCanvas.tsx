import "../../base.css"

import { CSSProperties, useMemo, useRef, useEffect } from "react"
import { boardSize } from "../../logic/logicConfig.ts"
import { drawBoard } from "./drawBoard.ts"
import { styled } from "styled-components"
import { rel } from "../../lib/rel.ts"
import { gridBackground } from "../../lib/gridBackground.ts"

export function BoardCanvas({ scale }: { scale: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const canvasSizeStyle = useMemo<CSSProperties>(
    () => ({
      width: boardSize.width * scale,
      height: boardSize.height * scale,
    }),
    [scale],
  )

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
  border: ${rel(3)} solid rgba(17, 212, 255, 0.5);
  ${gridBackground};
`
