/// <reference types="vite/client" />

import {
  GAME_RENDERED_HEIGHT,
  GAME_WIDTH,
  GameState,
  PADDLE_HEIGHT,
  PADDLE_OFFSET,
  PADDLE_SPEED,
} from "./logic"
import {
  renderBall,
  renderHelp,
  renderPaddle,
  renderPopup,
  renderScore,
  SCORE_DURATION,
  setupCanvas,
} from "./render"
import { Interpolator, InterpolatorLatency, Players } from "rune-sdk"
import { initControls } from "./controls"
import { playSound } from "./playSound.ts"

import "./roundRectPolyfill.js"

// Interpolate between updates to support variable FPS
let playerPaddleInterpolator:
  | Interpolator<number>
  | InterpolatorLatency<number> = Rune.interpolator<number>()
const ballInterpolator = Rune.interpolator<[number, number]>()

// Prevent paddle from teleporting around when receiving action from the past
const opponentPaddleInterpolator = Rune.interpolatorLatency<number>({
  maxSpeed: PADDLE_SPEED + 1,
  timeToMaxSpeed: 200,
})

const { canvas, context } = setupCanvas()

let game: GameState
let players: Players
let futureGame: GameState
let yourPlayerId: string | undefined

let opponentIndex = 0
let playerIndex = 0

const images = [new Image(22, 22), new Image(22, 22)]

let lastScoredAt = 0
let lastScoredBy: number | null = null

let hasMoved = false

window.onload = function () {
  document.body.appendChild(canvas)

  Rune.initClient({
    onChange: (params) => {
      game = params.game

      futureGame = params.futureGame!
      players = params.players
      yourPlayerId = params.yourPlayerId

      if (params.event?.name === "stateSync") {
        hasMoved = false
        images[0].src = players[game.players[0].id]?.avatarUrl
        images[1].src = players[game.players[1].id]?.avatarUrl

        playerIndex =
          yourPlayerId && game.players[0].id === yourPlayerId ? 0 : 1
        opponentIndex = playerIndex === 0 ? 1 : 0

        if (!yourPlayerId) {
          // In case client is a spectator, use latency interpolator for both paddles
          playerPaddleInterpolator = Rune.interpolatorLatency<number>({
            maxSpeed: PADDLE_SPEED + 1,
          })
        }

        initControls(
          () => (hasMoved = true),
          () => yourPlayerId !== undefined,
          () => game.paddles[playerIndex].position
        )
      }

      // Always interpolate except when the score changes
      if (game.totalScore === futureGame.totalScore) {
        ballInterpolator.update({
          game: game.ball.position,
          futureGame: futureGame.ball.position,
        })

        opponentPaddleInterpolator.update({
          game: game.paddles[opponentIndex].position,
          futureGame: futureGame.paddles[opponentIndex].position,
        })

        playerPaddleInterpolator.update({
          game: game.paddles[playerIndex].position,
          futureGame: futureGame.paddles[playerIndex].position,
        })
      }

      // Play sounds etc. when the score changes
      if (game.totalScore > params.previousGame.totalScore) {
        lastScoredAt = performance.now()

        lastScoredBy =
          params.previousGame.players[0].score !== game.players[0].score ? 0 : 1

        if (lastScoredBy === playerIndex) {
          playSound("playerScore")
        } else {
          playSound("opponentScore")
        }

        if (!yourPlayerId) {
          ;(playerPaddleInterpolator as InterpolatorLatency<number>).jump(
            game.paddles[opponentIndex].position
          )
        }

        // Reset opponent paddle position after score w/o interpolation
        opponentPaddleInterpolator.jump(game.paddles[opponentIndex].position)
      }

      if (
        futureGame.paddleHit !== null &&
        futureGame.paddleHit !== game.paddleHit
      ) {
        if (playerIndex === futureGame.paddleHit) {
          playSound("playerHit")
        } else {
          playSound("opponentHit")
        }
      }
    },
  })

  let frame = 0

  function render() {
    frame++
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = "#150813"
    context.fillRect(0, 0, GAME_WIDTH, GAME_RENDERED_HEIGHT)

    if (game) {
      renderScore(
        context,
        25,
        images[opponentIndex],
        players[game.players[opponentIndex].id]?.displayName || "",
        game.players[opponentIndex].score
      )

      renderScore(
        context,
        GAME_RENDERED_HEIGHT - 25,
        images[playerIndex],
        yourPlayerId !== undefined
          ? "You"
          : players[game.players[playerIndex].id]?.displayName || "",
        game.players[playerIndex].score
      )

      if (lastScoredBy !== null) {
        if (performance.now() - lastScoredAt > SCORE_DURATION) {
          lastScoredAt = 0
          lastScoredBy = null
        } else {
          renderPopup(
            context,
            players[game.players[lastScoredBy].id].displayName,
            lastScoredAt
          )
        }
      }

      renderBall(
        context,
        true,
        game.players[0].id === yourPlayerId,
        ...ballInterpolator.getPosition()
      )

      // Always render your own paddle at the bottom.
      // Add some offset to have space for controlling your paddle.
      renderPaddle(
        context,
        PADDLE_OFFSET / 2,
        opponentPaddleInterpolator.getPosition()
      )

      const position =
        yourPlayerId && !hasMoved
          ? playerPaddleInterpolator.getPosition() +
            Math.sin(frame / 60) * GAME_WIDTH * 0.03
          : playerPaddleInterpolator.getPosition()

      renderPaddle(
        context,
        GAME_RENDERED_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT,
        position
      )

      if (yourPlayerId && !hasMoved) {
        renderHelp(
          context,
          GAME_RENDERED_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT,
          position
        )
      }
    }

    // Call render() again when browser is ready to render another frame
    requestAnimationFrame(render)
  }

  render()
}
