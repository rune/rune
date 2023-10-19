import { colors } from "./logicConfig.ts"
import { updateCountdown } from "./updateCountdown.ts"
import { updateEndOfRound } from "./updateEndOfRound.ts"
import { updatePlaying } from "./updatePlaying.ts"
import { checkWinnersAndGameOver } from "./checkWinnersAndGameOver.ts"
import { pickFreeColor } from "./pickFreeColor.ts"
import { newRound } from "./newRound.ts"

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    return {
      stage: "gettingReady",
      players: allPlayerIds.map((playerId, index) => ({
        playerId,
        color: colors[index],
        state: "alive",
        score: 0,
      })),
      snakes: allPlayerIds.reduce(
        (acc, playerId) => ({
          ...acc,
          [playerId]: {
            gapCounter: 0,
            turning: "none",
            line: [],
          },
        }),
        {},
      ),
      collisionGrid: {},
      readyPlayerIds: [],
      timer: 0,
      timerStartedAt: 0,
      lastRoundWinnerId: undefined,
    }
  },
  updatesPerSecond: 30,
  actions: {
    setTurning(turning, { game, playerId }) {
      const snake = game.snakes[playerId]
      snake.turning = turning
    },
    setReady(_, { game }) {
      newRound(game)
    },
  },
  update: ({ game }) => {
    if (game.stage === "countdown") updateCountdown(game)
    if (game.stage === "playing") updatePlaying(game)
    if (game.stage === "endOfRound") updateEndOfRound(game)
  },
  events: {
    playerJoined: (playerId, { game }) => {
      game.players.push({
        playerId,
        color: pickFreeColor(game.players),
        state: "pending",
        score: 0,
      })
      game.snakes[playerId] = {
        gapCounter: 0,
        turning: "none",
        line: [],
      }
    },
    playerLeft: (playerId, { game }) => {
      const index = game.players.findIndex((p) => p.playerId === playerId)

      if (~index) game.players.splice(index, 1)
      delete game.snakes[playerId]

      if (game.stage === "playing" || game.stage === "countdown") {
        checkWinnersAndGameOver(game)
      }
    },
  },
})
