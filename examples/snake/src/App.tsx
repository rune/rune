import "./base.css"

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import { boardSize, arcRadius } from "./logic/logic.ts"
import { styled } from "styled-components"
import { InputTracker } from "./components/InputTracker.tsx"
import { $state, store } from "./state/state.ts"
import { Point } from "./logic/types.ts"
import { degreesToRad } from "./lib/helpers.ts"

const headerHeight = 100

function drawArrow(
  ctx: CanvasRenderingContext2D,
  point: Point,
  angle: number,
  color: string
) {
  const angleInRad = degreesToRad(angle)
  const size = 10 * window.devicePixelRatio
  const sharpness = 10

  ctx.beginPath()
  ctx.moveTo(point.x, point.y)
  ctx.lineTo(
    point.x - size * Math.cos(angleInRad - Math.PI / sharpness),
    point.y - size * Math.sin(angleInRad - Math.PI / sharpness)
  )
  ctx.lineTo(
    point.x - size * Math.cos(angleInRad + Math.PI / sharpness),
    point.y - size * Math.sin(angleInRad + Math.PI / sharpness)
  )
  ctx.lineTo(point.x, point.y)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 10 * window.devicePixelRatio

  ctx.stroke()
  ctx.stroke()
  ctx.fill()
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string
) {
  ctx.beginPath()
  ctx.arc(point.x, point.y, 7.5 * window.devicePixelRatio, 0, 2 * Math.PI)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 10 * window.devicePixelRatio

  ctx.stroke()
  ctx.stroke()
  ctx.fill()
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

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = 10 * window.devicePixelRatio
  ctx.shadowColor = color

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
          section.arcCenter.x * scale,
          section.arcCenter.y * scale,
          arcRadius * scale,
          section.arcStartAngle,
          section.arcEndAngle,
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

  for (const player of game.players) {
    const lastSection = player.line[player.line.length - 1]

    if (player.state === "alive") {
      drawArrow(
        ctx,
        { x: lastSection.end.x * scale, y: lastSection.end.y * scale },
        lastSection.endAngle,
        player.color
      )
    } else {
      drawCircle(
        ctx,
        { x: lastSection.end.x * scale, y: lastSection.end.y * scale },
        player.color
      )
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

      const newScale = Math.min(widthScale, heightScale)

      setScale(newScale > 0 ? newScale : 1)
    }

    calculateScale()

    window.addEventListener("resize", calculateScale)

    return () => window.removeEventListener("resize", calculateScale)
  }, [])

  useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined
    function tick() {
      if (canvasRef.current) {
        draw(canvasRef.current, scale * window.devicePixelRatio)
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
