import "./base.css"

import { useEffect, useRef, useState, useMemo, CSSProperties } from "react"
import { boardSize, Point } from "./logic.ts"
import { styled } from "styled-components"
import { InputTracker } from "./components/InputTracker.tsx"
import { $state, store } from "./state/state.ts"

const headerHeight = 100

function drawLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  color: string
) {
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = 10 * window.devicePixelRatio
  ctx.shadowColor = color

  // to make a thicker shadow
  ctx.stroke()
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

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = 10 * window.devicePixelRatio
  ctx.shadowColor = color

  // to make a thicker shadow
  ctx.stroke()
  ctx.stroke()
}

function draw(canvas: HTMLCanvasElement, scale: number) {
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
          section.arc.center.x * scale,
          section.arc.center.y * scale,
          section.arc.radius * scale,
          section.arc.startAngle,
          section.arc.endAngle,
          section.turning === "left",
          player.color
        )
      } else {
        drawLine(
          ctx,
          { x: section.start.x * scale, y: section.start.y * scale },
          { x: section.end.x * scale, y: section.end.y * scale },
          player.color
        )
      }
    }
  }
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function calculateScale() {
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight - headerHeight

      const widthScale = containerWidth / boardSize.width
      const heightScale = containerHeight / boardSize.height

      setScale(Math.min(widthScale, heightScale))
    }

    calculateScale()

    window.addEventListener("resize", calculateScale)

    return () => window.removeEventListener("resize", calculateScale)
  }, [])

  useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined
    function tick() {
      if (canvasRef.current)
        draw(canvasRef.current, scale * window.devicePixelRatio)
      // if (canvas2Ref.current) draw(canvas2Ref.current)

      handle = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      if (handle) cancelAnimationFrame(handle)
    }
  }, [scale])

  const canvasSizeStyle = useMemo<CSSProperties>(
    () => ({
      width: boardSize.width * scale,
      height: boardSize.height * scale,
    }),
    [scale]
  )

  return (
    <>
      <InputTracker />
      <Root>
        <Header />
        <CanvasContainer>
          <Canvas
            ref={canvasRef}
            width={boardSize.width * scale * window.devicePixelRatio}
            height={boardSize.height * scale * window.devicePixelRatio}
            style={canvasSizeStyle}
          />
        </CanvasContainer>
      </Root>
    </>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  height: ${headerHeight}px;
  background: green;
`

const CanvasContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  background: blue;
`

const Canvas = styled.canvas`
  background: black;
`
