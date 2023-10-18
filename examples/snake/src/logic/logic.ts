import { getNewPlayer } from "./getNewPlayer.ts"
import { checkReady } from "./checkReady.ts"
import { colors } from "./logicConfig.ts"
import { updateCountdown } from "./updateCountdown.ts"
import { updateEndOfRound } from "./updateEndOfRound.ts"
import { updatePlaying } from "./updatePlaying.ts"

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    return {
      stage: "gettingReady",
      players: allPlayerIds.map((playerId, index) =>
        getNewPlayer(playerId, colors[index]),
      ),
      collisionGrid: [],
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
    setReady(_, { game, playerId, allPlayerIds }) {
      if (game.readyPlayerIds.includes(playerId)) throw Rune.invalidAction()

      game.readyPlayerIds.push(playerId)

      checkReady(game, allPlayerIds)
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
        ...getNewPlayer(playerId, colors[game.players.length]),
        state: "pending",
      })
    },
    playerLeft: (playerId, { game, allPlayerIds }) => {
      const index = game.players.findIndex((p) => p.playerId === playerId)
      if (~index) game.players.splice(index, 1)
      checkReady(game, allPlayerIds)
    },
  },
})
