/// <reference types="vite/client" />

import {
  BOTTOM_PADDLE_POSITION,
  GAME_HEIGHT,
  GAME_WIDTH,
  GameState,
  PADDLE_SPEED,
  TOP_PADDLE_POSITION,
} from "./logic"
import {
  renderBall,
  renderPaddle,
  renderPopup,
  renderScore,
  SCORE_DURATION,
  setupCanvas,
} from "./render"
import { Players } from "rune-games-sdk"
import { initControls } from "./controls"

import playerScoreSfx from "./assets/PlayerScore.mp3"
import opponentScoreSfx from "./assets/OponentScore.mp3"
import opponentHitSfx from "./assets/OpponentHit.mp3"
import playerHitSfx from "./assets/PlayerHit.wav"

const ballInterpolator = Rune.interpolator<[number, number]>()
const opponentPaddleInterpolator = Rune.interpolatorLatency<number>({
  maxSpeed: PADDLE_SPEED + 1,
  timeToMaxSpeed: 0,
})
const playerPaddleInterpolator = Rune.interpolator<number>()

const { canvas, context } = setupCanvas()

let game: GameState
let players: Players
let futureGame: GameState
let yourPlayerId: string | undefined

let opponentIndex = 0
let playerIndex = 0

let isReady = false
const images = [new Image(22, 22), new Image(22, 22)]

let lastScoreAt = 0
let lastScoredBy: number | null = null

window.onload = function () {
  document.body.appendChild(canvas)

  const audio = {
    playerScore: new Audio(playerScoreSfx),
    opponentScore: new Audio(opponentScoreSfx),
    playerHit: new Audio(playerHitSfx),
    opponentHit: new Audio(opponentHitSfx),
  }

  Rune.initClient({
    onChange: (params) => {
      game = params.game

      futureGame = params.futureGame!
      players = params.players
      yourPlayerId = params.yourPlayerId

      if (!isReady) {
        isReady = true
        images[0].src = players[game.players[0].id].avatarUrl
        images[1].src = players[game.players[1].id].avatarUrl

        playerIndex =
          yourPlayerId && game.players[0].id === yourPlayerId ? 0 : 1
        opponentIndex = playerIndex === 0 ? 1 : 0

        if (yourPlayerId) {
          initControls()
        }
      }

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

      if (params.previousGame.totalScore !== game.totalScore) {
        lastScoreAt = performance.now()

        lastScoredBy =
          params.previousGame.players[0].score !== game.players[0].score ? 0 : 1

        if (lastScoredBy === playerIndex) {
          audio.playerScore.play()
        } else {
          audio.opponentScore.play()
        }

        opponentPaddleInterpolator.jump(game.paddles[opponentIndex].position)
      }

      if (
        game.paddleHit !== null &&
        params.previousGame.paddleHit !== game.paddleHit
      ) {
        if (playerIndex === game.paddleHit) {
          audio.playerHit.play()
        } else {
          audio.opponentHit.play()
        }
      }
    },
  })
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = "#150813"
  context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  if (game) {
    renderScore(
      context,
      25,
      images[opponentIndex],
      players[game.players[opponentIndex].id].displayName,
      game.players[opponentIndex].score
    )

    renderScore(
      context,
      GAME_HEIGHT - 25,
      images[playerIndex],
      yourPlayerId !== undefined
        ? "You"
        : players[game.players[playerIndex].id].displayName,
      game.players[playerIndex].score
    )

    if (lastScoredBy !== null) {
      if (performance.now() - lastScoreAt > SCORE_DURATION) {
        lastScoreAt = 0
        lastScoredBy = null
      } else {
        renderPopup(
          context,
          players[game.players[lastScoredBy].id].displayName,
          lastScoreAt
        )
      }
    }

    renderBall(
      context,
      game.players[0].id === yourPlayerId,
      ...ballInterpolator.getPosition()
    )

    renderPaddle(
      context,
      TOP_PADDLE_POSITION,
      opponentPaddleInterpolator.getPosition()
    )

    renderPaddle(
      context,
      BOTTOM_PADDLE_POSITION,
      playerPaddleInterpolator.getPosition()
    )
  }

  requestAnimationFrame(render)
}

render()
