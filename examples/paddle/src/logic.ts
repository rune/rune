import { PlayerId, RuneClient } from "rune-games-sdk"

const updatesPerSecond = 30

const speedMultiplier = 60 / updatesPerSecond
export const GAME_WIDTH = 320
export const GAME_HEIGHT = 640
export const PADDLE_HEIGHT = 10
export const PADDLE_OFFSET = 100
export const PADDLE_WIDTH = 64
export const PADDLE_SPEED = 4 * speedMultiplier

export const POINTS_TO_WIN = 10

// Get the middle y-value to draw the paddle using the relationship between
// the height of the canvas and the height of the paddle
const MIDDLE_X = (GAME_WIDTH - PADDLE_WIDTH) / 2

export const TOP_PADDLE_POSITION = PADDLE_OFFSET
export const BOTTOM_PADDLE_POSITION =
  GAME_HEIGHT - PADDLE_HEIGHT - PADDLE_OFFSET

export const BALL_RADIUS = 5

export type Ball = {
  position: [number, number]
  xSpeed: number
  ySpeed: number
}

export type Paddle = {
  position: number
  y: number
  speed: number
}

type Player = { id: PlayerId; score: number }

export interface GameState {
  desiredPosition: [number | null, number | null]
  ball: Ball
  paddles: [Paddle, Paddle]
  players: [Player, Player]
  totalScore: number
}

export type GameActions = {
  setPosition: (position: number) => void
}
export type RuneTyped = RuneClient<GameState, GameActions>

declare global {
  const Rune: RuneTyped
}

function movePaddle(paddle: Paddle, position: number) {
  paddle.position += position
  paddle.speed = position
  if (paddle.position < 0) {
    // all the way to the side
    paddle.position = 0
    paddle.speed = 0
  } else if (paddle.position + PADDLE_WIDTH > GAME_WIDTH) {
    // all the way to the top
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
  ball.position[0] += ball.xSpeed
  ball.position[1] += ball.ySpeed

  const topX = ball.position[0] - 5
  const topY = ball.position[1] - 5

  const bottomX = ball.position[0] + 5
  const bottomY = ball.position[1] + 5

  if (ball.position[0] - 5 < 0) {
    // hitting the left wall
    ball.position[0] = 5
    ball.xSpeed *= -1
  } else if (ball.position[0] + 5 > GAME_WIDTH) {
    // hitting the right wall
    ball.position[0] = GAME_WIDTH - 5
    ball.xSpeed *= -1
  }

  // A point was score, reset the ball
  if (ball.position[1] < 0 || ball.position[1] > GAME_HEIGHT) {
    if (ball.position[1] < 0) {
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

    ball.ySpeed = 3 * speedMultiplier * direction
    ball.xSpeed = 0
    ball.position[0] = GAME_WIDTH / 2
    ball.position[1] = GAME_HEIGHT / 2
    paddle1.position = MIDDLE_X
    paddle2.position = MIDDLE_X
  }

  if (topY < GAME_HEIGHT / 2) {
    if (
      topY < paddle1.y + PADDLE_HEIGHT &&
      bottomY > paddle1.y &&
      topX < paddle1.position + PADDLE_WIDTH &&
      bottomX > paddle1.position
    ) {
      // hit the player's paddle
      ball.ySpeed = 3 * speedMultiplier
      ball.xSpeed += paddle1.speed / 2
      ball.position[1] += ball.ySpeed
    }
  } else {
    if (
      topY < paddle2.y + PADDLE_HEIGHT &&
      bottomY > paddle2.y &&
      topX < paddle2.position + PADDLE_WIDTH &&
      bottomX > paddle2.position
    ) {
      // hit the computer's paddle
      ball.ySpeed = -3 * speedMultiplier
      ball.xSpeed += paddle2.speed / 2
      ball.position[1] += ball.ySpeed
    }
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
        xSpeed: 0,
        ySpeed: 3 * speedMultiplier,
      },
      paddles: [
        {
          position: MIDDLE_X,
          y: TOP_PADDLE_POSITION,
          speed: 0,
        },
        {
          position: MIDDLE_X,
          y: BOTTOM_PADDLE_POSITION,
          speed: 0,
        },
      ],
      desiredPosition: [null, null],
      totalScore: 0,
    }
  },
  actions: {
    setPosition: (position, { game, playerId }) => {
      const index = game.players[0].id === playerId ? 0 : 1

      game.desiredPosition[index] = position
    },
  },
  update: ({ game }) => {
    for (let i = 0; i < 2; i++) {
      const desiredPosition = game.desiredPosition[i]

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
