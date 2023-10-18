import "../base.css"

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import { boardSize, arcRadius } from "../logic/logic.ts"
import { styled } from "styled-components"
import { store, $game } from "../state/state.ts"
import { Point } from "../logic/types.ts"

function drawArrow(
  ctx: CanvasRenderingContext2D,
  point: Point,
  angle: number,
  color: string,
) {
  const arrowWidth = 8.41
  const arrowPath =
    "M3.29626 0.923214C3.74166 -0.149229 5.43456 -0.115187 5.82663 0.974098L8.44648 8.25278C8.78118 9.18266 8.46881 10.2164 7.53811 10.7162C6.70522 11.1634 5.63292 11.6043 4.642 11.6043C3.56881 11.6043 2.35189 11.1758 1.38414 10.7351C0.299816 10.2414 -0.0889469 9.07425 0.337459 8.04753L3.29626 0.923214Z"

  const arrow = new Path2D()
  const transforms = new DOMMatrix()

  transforms.translateSelf(point.x, point.y)
  transforms.scaleSelf(window.devicePixelRatio)
  transforms.rotateSelf(angle - 270)
  transforms.translateSelf(-arrowWidth / 2, -1) // -1 to shift the arrow forward a bit, so it's tip isn't mixed with the line end

  arrow.addPath(new Path2D(arrowPath), transforms)

  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 10 * window.devicePixelRatio

  ctx.fill(arrow)
  ctx.fill(arrow)
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string,
) {
  ctx.beginPath()
  ctx.arc(point.x, point.y, 7.5 * window.devicePixelRatio, 0, 2 * Math.PI)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 10 * window.devicePixelRatio

  ctx.fill()
  ctx.fill()
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  color: string,
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
  color: string,
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

function drawRect(
  ctx: CanvasRenderingContext2D,
  point: Point,
  width: number,
  height: number,
  color: string,
  fillColor?: string,
) {
  ctx.beginPath()
  ctx.rect(point.x, point.y, width, height)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = 0
  ctx.stroke()

  if (fillColor) {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
}

function draw(canvas: HTMLCanvasElement, scale: number) {
  const ctx = canvas.getContext("2d")

  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const game = store.get($game)

  // for (let cellIndex = 0; cellIndex < game.collisionGrid.length; cellIndex++) {
  //   const point = collisionGridIndexToPoint(cellIndex)
  //
  //   drawRect(
  //     ctx,
  //     { x: point.x * scale, y: point.y * scale },
  //     pixelsPerCollisionGridSquare * scale,
  //     pixelsPerCollisionGridSquare * scale,
  //     "rgba(255,255,255,.1)",
  //     game.collisionGrid[cellIndex] ? "rgba(255,255,255,.5)" : undefined,
  //   )
  // }

  for (const player of game.players) {
    if (player.state === "pending") continue

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
          player.color,
        )
      } else {
        drawLine(
          ctx,
          { x: section.start.x * scale, y: section.start.y * scale },
          { x: section.end.x * scale, y: section.end.y * scale },
          player.color,
        )
      }
    }
  }

  for (const player of game.players) {
    if (player.state === "pending") continue

    const lastSection = player.line[player.line.length - 1]

    if (player.state === "alive") {
      drawArrow(
        ctx,
        { x: lastSection.end.x * scale, y: lastSection.end.y * scale },
        lastSection.endAngle,
        player.color,
      )
    } else {
      drawCircle(
        ctx,
        { x: lastSection.end.x * scale, y: lastSection.end.y * scale },
        player.color,
      )
    }
  }
}

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
