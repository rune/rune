import {
  BALL_RADIUS,
  GAME_HEIGHT,
  GAME_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  POINTS_TO_WIN,
} from "./logic.ts"
import { fittingString } from "./helpers.ts"
import badNetworkImage from "./assets/WiFiSymbols.png"

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
  renderGlow: boolean,
  inverse: boolean,
  x: number,
  y: number
) {
  const yPosition = inverse ? GAME_HEIGHT - y : y

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

const badNetwork = new Image()
badNetwork.src = badNetworkImage
export function renderBadNetwork(context: CanvasRenderingContext2D) {
  context.drawImage(badNetwork, GAME_WIDTH / 2 - 78 / 2, 148, 78, 78)
}
