import "./base.css"

import { useEffect, useRef } from "react"
import { boardSize } from "./logic.ts"
import { styled } from "styled-components"
import { rel } from "./lib/rel.ts"
import { InputTracker } from "./components/InputTracker.tsx"
import { store, $state } from "./state/state.ts"

function draw(canvas: HTMLCanvasElement) {
  const game = store.get($state).game

  if (canvas) {
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "#10D4FF"
      ctx.lineWidth = 3
      ctx.shadowColor = "#10D4FF"

      for (const player of game.players) {
        const startingPoint = player.line[0]

        ctx.beginPath()
        ctx.moveTo(startingPoint.x, startingPoint.y)

        for (const point of player.line) {
          ctx.lineTo(point.x, point.y)
        }

        ctx.shadowBlur = 0
        ctx.stroke()
        ctx.shadowBlur = 7.5
        ctx.stroke()
        ctx.shadowBlur = 15
        ctx.stroke()
      }
    }
  }
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas2Ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined
    function tick() {
      if (canvasRef.current) draw(canvasRef.current)
      // if (canvas2Ref.current) draw(canvas2Ref.current)

      handle = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      if (handle) cancelAnimationFrame(handle)
    }
  }, [])

  return (
    <>
      <InputTracker />
      <Root>
        <Header />
        <div style={{ position: "relative" }}>
          <Canvas
            ref={canvasRef}
            width={boardSize.width}
            height={boardSize.height}
          />
          <Canvas2
            ref={canvas2Ref}
            width={boardSize.width}
            height={boardSize.height}
          />
        </div>
      </Root>
    </>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: black;
`

const Header = styled.div`
  height: ${rel(100)};
  background: green;
`

const Canvas = styled.canvas`
  border: 1px dashed red;
  width: 100%;
  aspect-ratio: ${boardSize.width} / ${boardSize.height};
`

const Canvas2 = styled(Canvas)`
  position: absolute;
  left: 0;
  top: 0;
  //filter: blur(10px);
`
