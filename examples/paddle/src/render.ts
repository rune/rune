import {
  BALL_RADIUS,
  GAME_HEIGHT,
  GAME_WIDTH,
  PADDLE_HEIGHT,
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
  const scaleY = window.innerHeight / GAME_HEIGHT

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
  inverse: boolean,
  x: number,
  y: number
) {
  context.beginPath()
  context.arc(x, inverse ? GAME_HEIGHT - y : y, BALL_RADIUS, 2 * Math.PI, 0)
  context.fillStyle = "rgba(1, 206, 75, 1)"
  context.fill()
}

export const SCORE_DURATION = 1500

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

export function renderScore(
  context: CanvasRenderingContext2D,
  y: number,
  image: HTMLImageElement,
  name: string,
  score: number
) {
  context.drawImage(image, 20, y - 10, 22, 22)

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
