import {
  BALL_RADIUS,
  GAME_HEIGHT,
  GAME_RENDERED_HEIGHT,
  GAME_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_OFFSET,
  PADDLE_WIDTH,
  POINTS_TO_WIN,
} from "./logic.ts"
import { fittingString } from "./helpers.ts"

export function setupCanvas(): {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
} {
  const canvas = document.createElement("canvas")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const scaleX = window.innerWidth / GAME_WIDTH
  const scaleY = window.innerHeight / GAME_RENDERED_HEIGHT

  canvas.style.height = "100vh"
  canvas.style.width = "100vw"
  const context = canvas.getContext("2d")!

  context.scale(scaleX, scaleY)

  return {
    canvas,
    context,
  }
}

export function renderBall(
  context: CanvasRenderingContext2D,
  renderGlow: boolean,
  inverse: boolean,
  x: number,
  y: number
) {
  const yPosition = (inverse ? GAME_HEIGHT - y : y) - PADDLE_OFFSET / 2

  if (renderGlow) {
    const radius = 20

    const radgrad = context.createRadialGradient(
      x,
      yPosition,
      0,
      x,
      yPosition,
      radius
    )
    radgrad.addColorStop(0, "rgba(1, 206, 75, 1)")
    radgrad.addColorStop(BALL_RADIUS / radius, "rgba(1, 206, 75, 1)")
    radgrad.addColorStop(BALL_RADIUS / radius + 0.01, "rgba(1, 206, 75, 0.3)")
    radgrad.addColorStop(1, "rgba(1, 206, 75, 0)")

    // draw shape
    context.fillStyle = radgrad
    context.fillRect(x - radius, yPosition - radius, radius * 2, radius * 2)
  } else {
    context.beginPath()
    context.arc(x, yPosition, BALL_RADIUS, 2 * Math.PI, 0)
    context.fillStyle = "rgba(1, 206, 75, 1)"
    context.fill()
  }
}

export const SCORE_DURATION = 1500

export const BAD_NETWORK_DURATION = 3000

export function renderPopup(
  context: CanvasRenderingContext2D,
  displayName: string,
  lastScoreAt: number
) {
  const alpha = 1 - (performance.now() - lastScoreAt) / SCORE_DURATION

  context.fillStyle = "rgba(206, 1, 132, " + alpha + ")"

  context.font = "800 24px Poppins Bold"
  context.textAlign = "center"
  context.fillText("+1", GAME_WIDTH / 2, 130)

  context.font = "400 12px Poppins"
  context.textAlign = "center"
  context.fillText(displayName, GAME_WIDTH / 2, 150)
}

const handImage = new Image(22, 22)
handImage.src = "hand.png"

export function renderPaddle(
  context: CanvasRenderingContext2D,
  y: number,
  x: number
) {
  context.fillStyle = "rgba(206, 1, 132, 1)"

  context.beginPath()
  context.roundRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT, [4])
  context.fill()
}

export function renderHelp(
  context: CanvasRenderingContext2D,
  y: number,
  x: number
) {
  context.font = "400 10px Poppins"
  context.fillStyle = "rgba(255, 255, 255, 1)"
  context.textAlign = "center"
  context.fillText("Hold to move", x + PADDLE_WIDTH / 2, y + 55)

  context.drawImage(handImage, x + PADDLE_WIDTH / 2 - 20, y - 8, 69, 54)
}

export function renderScore(
  context: CanvasRenderingContext2D,
  y: number,
  image: HTMLImageElement,
  name: string,
  score: number
) {
  if (name) {
    context.drawImage(image, 20, y - 10, 22, 22)
  }

  context.beginPath()
  context.roundRect(20, y - 10, 80, 22, [26])

  context.strokeStyle = "rgba(206, 1, 132, 1)"
  context.fillStyle = "rgba(206, 1, 132, 1)"

  context.stroke()

  context.font = "400 10px Poppins"
  context.textAlign = "center"
  context.fillText(fittingString(context, name, 50), 48 + 20, y + 4)

  for (let i = 0; i < POINTS_TO_WIN; i++) {
    context.beginPath()
    context.arc(115 + i * (7 + 6 * 2), y, 6, 2 * Math.PI, 0)

    context.fillStyle = "rgba(206, 1, 132, 1)"
    context.strokeStyle = "rgba(206, 1, 132, 1)"

    if (i < score) {
      context.fill()
    } else {
      context.stroke()
    }
  }
}
