import { getNewPlayer } from "./getNewPlayer.ts"
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
      players: allPlayerIds.map((playerId, index) =>
        getNewPlayer({
          playerId,
          state: "alive",
          color: colors[index],
        }),
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
      const player = game.players.find((p) => p.playerId === playerId)

      if (!player) throw Rune.invalidAction()

      player.turning = turning
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
      game.players.push(
        getNewPlayer({
          playerId,
          state: "pending",
          color: pickFreeColor(game),
        }),
      )
    },
    playerLeft: (playerId, { game }) => {
      const index = game.players.findIndex((p) => p.playerId === playerId)

      if (~index) game.players.splice(index, 1)

      // TODO: not working if leaving during countdown
      if (game.stage === "playing") checkWinnersAndGameOver(game)
    },
  },
})
