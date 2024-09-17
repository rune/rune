import type { PlayerId } from "rune-sdk"

// Use multiplayer so updatesPerSecond can be changed w/o impacting game speed
const updatesPerSecond = 30
const speedMultiplier = 60 / updatesPerSecond

export const GAME_WIDTH = 320
export const PADDLE_OFFSET = 100

// Render only part of game screen to add space for controlling your paddle
export const GAME_RENDERED_HEIGHT = 600
export const GAME_HEIGHT = GAME_RENDERED_HEIGHT + PADDLE_OFFSET / 2

export const PADDLE_HEIGHT = 10
export const PADDLE_WIDTH = 64
export const PADDLE_SPEED = 4 * speedMultiplier

export const MAX_BALL_SPEED = 20

export const POINTS_TO_WIN = 10

const PADDLE_START_POSITION = (GAME_WIDTH - PADDLE_WIDTH) / 2

export const TOP_PADDLE_POSITION = PADDLE_OFFSET
export const BOTTOM_PADDLE_POSITION =
  GAME_HEIGHT - PADDLE_HEIGHT - PADDLE_OFFSET

export const BALL_RADIUS = 5

type Ball = {
  position: [number, number]
  speed: [number, number]
}

type Paddle = {
  position: number
  speed: number
  isTop: boolean
}

type Player = { id: PlayerId; score: number }

export interface GameState {
  desiredPosition: [number | null, number | null]
  ball: Ball
  paddles: [Paddle, Paddle]
  players: [Player, Player]
  totalScore: number
  paddleHit: number | null
}

export type GameActions = {
  setPosition: (position: number) => void
}

function movePaddle(paddle: Paddle, position: number) {
  paddle.position += position
  paddle.speed = position

  if (paddle.position < 0) {
    paddle.position = 0
    paddle.speed = 0
  } else if (paddle.position + PADDLE_WIDTH > GAME_WIDTH) {
    paddle.position = GAME_WIDTH - PADDLE_WIDTH
    paddle.speed = 0
  }
}

function ballUpdate(
  ball: Ball,
  paddle1: Paddle,
  paddle2: Paddle,
  game: GameState
) {
  ball.position[0] += ball.speed[0]
  ball.position[1] += ball.speed[1]

  const left = ball.position[0] - BALL_RADIUS
  const top = ball.position[1] - BALL_RADIUS

  const right = ball.position[0] + BALL_RADIUS
  const bottom = ball.position[1] + BALL_RADIUS

  if (left < 0) {
    // Hitting the left wall
    ball.position[0] = BALL_RADIUS
    ball.speed[0] *= -1
  } else if (right > GAME_WIDTH) {
    // Hitting the right wall
    ball.position[0] = GAME_WIDTH - BALL_RADIUS
    ball.speed[0] *= -1
  }

  // Hitting the top paddle
  if (
    top < TOP_PADDLE_POSITION + PADDLE_HEIGHT &&
    bottom > TOP_PADDLE_POSITION &&
    left < paddle1.position + PADDLE_WIDTH &&
    right > paddle1.position
  ) {
    ball.speed = [
      Math.min(ball.speed[0] + paddle1.speed / 2, MAX_BALL_SPEED),
      3 * speedMultiplier,
    ]

    ball.position[1] += ball.speed[1]

    game.paddleHit = 0
  }

  // Hitting the bottom paddle
  if (
    top < BOTTOM_PADDLE_POSITION + PADDLE_HEIGHT &&
    bottom > BOTTOM_PADDLE_POSITION &&
    left < paddle2.position + PADDLE_WIDTH &&
    right > paddle2.position
  ) {
    ball.speed = [
      Math.min(ball.speed[0] + paddle2.speed / 2, MAX_BALL_SPEED),
      -3 * speedMultiplier,
    ]

    ball.position[1] += ball.speed[1]

    game.paddleHit = 1
  }

  // Add point if ball scores and reset
  if (top < 0 || bottom > GAME_HEIGHT) {
    if (top < 0) {
      game.players[1].score++
    } else {
      game.players[0].score++
    }
    game.totalScore++

    if (
      game.players[0].score >= POINTS_TO_WIN ||
      game.players[1].score >= POINTS_TO_WIN
    ) {
      Rune.gameOver({
        players: {
          [game.players[0].id]:
            game.players[0].score >= POINTS_TO_WIN ? "WON" : "LOST",
          [game.players[1].id]:
            game.players[1].score >= POINTS_TO_WIN ? "WON" : "LOST",
        },
      })
    }

    const direction = ball.position[1] < 0 ? -1 : 1

    ball.speed = [0, 3 * speedMultiplier * direction]
    ball.position[0] = GAME_WIDTH / 2
    ball.position[1] = GAME_HEIGHT / 2
    paddle1.position = PADDLE_START_POSITION
    paddle2.position = PADDLE_START_POSITION
  }
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  inputDelay: 30,
  updatesPerSecond,
  setup: (allPlayerIds): GameState => {
    return {
      players: [
        {
          id: allPlayerIds[0],
          score: 0,
        },
        {
          id: allPlayerIds[1],
          score: 0,
        },
      ],
      ball: {
        position: [GAME_WIDTH / 2, GAME_HEIGHT / 2],
        speed: [0, 3 * speedMultiplier],
      },
      paddles: [
        {
          position: PADDLE_START_POSITION,
          isTop: true,
          speed: 0,
        },
        {
          position: PADDLE_START_POSITION,
          isTop: false,
          speed: 0,
        },
      ],
      desiredPosition: [null, null],
      totalScore: 0,
      paddleHit: null,
    }
  },
  actions: {
    // Player sets position they're moving towards.
    // Update function then moves paddle towards that.
    setPosition: (position, { game, playerId }) => {
      const index = game.players[0].id === playerId ? 0 : 1
      game.desiredPosition[index] = position
    },
  },
  update: ({ game }) => {
    game.paddleHit = null

    for (let i = 0; i < 2; i++) {
      const desiredPosition = game.desiredPosition[i]

      // Move towards desired position
      if (desiredPosition !== null) {
        const distance = desiredPosition - game.paddles[i].position

        if (distance === 0) {
          game.desiredPosition[i] = null
        }

        const calculatedValue =
          Math.min(Math.abs(distance), PADDLE_SPEED) * Math.sign(distance)

        movePaddle(game.paddles[i], calculatedValue)
      }
    }

    ballUpdate(game.ball, game.paddles[0], game.paddles[1], game)
  },
})
