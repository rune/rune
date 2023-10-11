import "./base.css"

import { useEffect, useRef } from "react"
import { boardSize } from "./logic.ts"
import { styled } from "styled-components"
import { rel } from "./lib/rel.ts"
import { InputTracker } from "./components/InputTracker.tsx"
import { $state, store } from "./state/state.ts"

function draw(canvas: HTMLCanvasElement) {
  const game = store.get($state).game

  if (canvas) {
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "#10D4FF"
      ctx.lineWidth = 2
      ctx.shadowColor = "#10D4FF"

      const arcStartLineAngle = 315
      const arcStart = { x: 200, y: 250 }
      const directionRight = true
      const iterations = 50

      const turningMod = directionRight ? 1 : -1

      // eslint-disable-next-line no-inner-declarations
      function drawPoint(point: { x: number; y: number }) {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2.5, 0, 2 * Math.PI)
        ctx.strokeStyle = "red"
        ctx.stroke()
      }

      drawPoint(arcStart)

      const forwardSpeedPixelsPerTick = 10
      const turningSpeedDegreesPerTick = 6

      const nextPoint = {
        x: arcStart.x,
        y: arcStart.y,
        angle: arcStartLineAngle,
      }

      for (let i = 0; i < iterations; i++) {
        const newAngle =
          nextPoint.angle + turningSpeedDegreesPerTick * turningMod

        nextPoint.x =
          nextPoint.x +
          Math.cos(newAngle * (Math.PI / 180)) * forwardSpeedPixelsPerTick
        nextPoint.y =
          nextPoint.y +
          Math.sin(newAngle * (Math.PI / 180)) * forwardSpeedPixelsPerTick
        nextPoint.angle = newAngle

        // draw point nextPoint
        drawPoint(nextPoint)
      }

      const arcRadius =
        (180 * forwardSpeedPixelsPerTick) /
        (Math.PI * turningSpeedDegreesPerTick)

      const circleCenterX =
        arcStart.x +
        Math.cos(
          (arcStartLineAngle +
            (turningSpeedDegreesPerTick / 2) * turningMod +
            90 * turningMod) *
            (Math.PI / 180)
        ) *
          arcRadius
      const circleCenterY =
        arcStart.y +
        Math.sin(
          (arcStartLineAngle +
            (turningSpeedDegreesPerTick / 2) * turningMod +
            90 * turningMod) *
            (Math.PI / 180)
        ) *
          arcRadius

      // draw circle center
      drawPoint({ x: circleCenterX, y: circleCenterY })

      ctx.strokeStyle = "white"
      ctx.beginPath()
      ctx.arc(
        circleCenterX,
        circleCenterY,
        arcRadius,
        (arcStartLineAngle +
          (turningSpeedDegreesPerTick / 2) * turningMod -
          90 * turningMod) *
          (Math.PI / 180),
        (nextPoint.angle +
          (turningSpeedDegreesPerTick / 2) * turningMod -
          90 * turningMod) *
          (Math.PI / 180),
        !directionRight
      )
      ctx.stroke()

      // ctx.beginPath()
      //
      // const x = 50
      // const y = 50
      // const radius = 20
      // const startAngle = Math.PI / 2
      // const endAngle = Math.PI
      //
      // const arcStartX = x + radius * Math.cos(startAngle)
      // const arcStartY = y + radius * Math.sin(startAngle)
      // const arcEndX = x + radius * Math.cos(endAngle)
      // const arcEndY = y + radius * Math.sin(endAngle)
      //
      // ctx.arc(x, y, radius, startAngle, endAngle)
      // ctx.stroke()

      // for (const player of game.players) {
      //   for (let i = 0; i < player.line.length; i++) {
      //     if (i === 0) continue
      //
      //     const previousPoint = player.line[i - 1]
      //     const point = player.line[i]
      //
      //     if (previousPoint.gap) continue
      //
      //     ctx.beginPath()
      //     ctx.moveTo(previousPoint.x, previousPoint.y)
      //     ctx.lineTo(point.x, point.y)
      //
      //     ctx.stroke()
      //
      //     // ctx.shadowBlur = 7.5
      //     // ctx.stroke()
      //     // ctx.shadowBlur = 15
      //     // ctx.stroke()
      //
      //     ctx.closePath()
      //   }
      // }
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

  console.log("render")
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
