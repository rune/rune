import "./base.css"

import { useEffect, useRef } from "react"
import { boardSize, Point } from "./logic.ts"
import { styled } from "styled-components"
import { rel } from "./lib/rel.ts"
import { InputTracker } from "./components/InputTracker.tsx"
import { $state, store } from "./state/state.ts"

function drawPoint(ctx: CanvasRenderingContext2D, point: Point, color: string) {
  ctx.beginPath()
  ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  color: string
) {
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.lineWidth = 5
  ctx.strokeStyle = color
  ctx.shadowBlur = 15
  ctx.shadowColor = color
  ctx.stroke()
}

function drawArc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  counterclockwise: boolean,
  color: string
) {
  ctx.beginPath()
  ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise)
  ctx.lineWidth = 5
  ctx.strokeStyle = color
  ctx.shadowBlur = 15
  ctx.shadowColor = color
  ctx.stroke()
}

function draw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const game = store.get($state).game

  for (const player of game.players) {
    for (const section of player.line) {
      if (section.gap) continue

      if (section.turning !== "none") {
        drawArc(
          ctx,
          section.arc.center.x,
          section.arc.center.y,
          section.arc.radius,
          section.arc.startAngle,
          section.arc.endAngle,
          section.turning === "left",
          player.color
        )
        drawPoint(ctx, section.arc.center, "yellow")
      } else {
        drawLine(ctx, section.start, section.end, player.color)
      }

      drawPoint(ctx, section.start, "yellow")
      drawPoint(ctx, section.end, "yellow")
    }
  }
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
