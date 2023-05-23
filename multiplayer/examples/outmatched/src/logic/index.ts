import {
  rows,
  cols,
  startingMovesPerRound,
  numberOfSpecialActions,
  numberOfRounds,
} from "./config"
import {
  getRandomTile,
  getScoreForChanges,
  getScores,
  hasValidMoves,
  isGameOver,
  isValidMove,
  match3,
  shuffle,
  swapAndMatch,
} from "./game"
import type { GameState, PlayersState } from "../types"

export const getLowestScore = (players: PlayersState) =>
  Object.values(players).reduce(
    (acc, player) => Math.min(acc, player.score),
    Number.MAX_SAFE_INTEGER
  )

const advanceToNextPlayer = (game: GameState) => {
  if (game.currentPlayerIndex === game.playerIds.length - 1) {
    game.roundsPlayed++
    if (isGameOver(game)) {
      return Rune.gameOver({
        players: getScores(game.players),
        delayPopUp: true,
      })
    }
    game.currentPlayerIndex = 0
    game.startingScore = getLowestScore(game.players)
  } else {
    game.currentPlayerIndex++
  }

  game.movesPlayed = 0
  game.movesPerRound = startingMovesPerRound
  if (game.roundsPlayed === numberOfRounds - 1) {
    const playerId = game.playerIds[game.currentPlayerIndex]
    game.movesPerRound += game.players[playerId].extraMovesRemaining
    game.players[playerId].extraMovesRemaining = 0
  }
  return game
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    let cells
    do {
      // Generate cells randomly until we get a playable board
      cells = new Array(rows * cols).fill(null).map(() => getRandomTile())
    } while (match3(cells).length !== 0 || !hasValidMoves(cells))

    return {
      playerIds: playerIds
        .slice()
        .sort(() => (0.5 - Math.random() < 0 ? -1 : 1)),
      currentPlayerIndex: 0,
      movesPlayed: 0,
      movesPerRound: startingMovesPerRound,
      roundsPlayed: 0,
      startingScore: 0,
      cells,
      highlightedCells: {},
      players: playerIds.reduce((acc, id) => {
        acc[id] = {
          score: 0,
          shufflesRemaining: numberOfSpecialActions,
          extraMovesRemaining: numberOfSpecialActions,
        }
        return acc
      }, {} as PlayersState),
      changes: [],
    }
  },
  actions: {
    swap: ({ sourceIndex, targetIndex }, { game, playerId }) => {
      // Cannot play during someone else's turn
      if (playerId !== game.playerIds[game.currentPlayerIndex]) {
        throw Rune.invalidAction()
      }
      if (!isValidMove(game.cells, sourceIndex, targetIndex)) {
        throw Rune.invalidAction()
      }

      const changes = swapAndMatch(game.cells, sourceIndex, targetIndex)

      game.changes = changes
      game.movesPlayed++
      game.players[playerId].score += getScoreForChanges(changes)
      game.highlightedCells = {}

      if (!hasValidMoves(game.cells)) {
        const { moved, cells } = shuffle(game.cells)

        game.changes.push({
          removed: [],
          merged: [],
          cleared: [],
          moved,
          added: {},
          message: "out-of-moves",
        })
        game.cells = cells
      }

      if (game.movesPlayed >= game.movesPerRound) {
        advanceToNextPlayer(game)
      }
    },
    shuffle: (_, { game, playerId }) => {
      if (
        playerId !== game.playerIds[game.currentPlayerIndex] ||
        game.players[playerId].shufflesRemaining <= 0
      ) {
        throw Rune.invalidAction()
      }

      const { moved, cells } = shuffle(game.cells)

      game.changes = [
        { removed: [], moved, added: {}, merged: [], cleared: [] },
      ]
      game.cells = cells
      game.highlightedCells = {}
      game.players[playerId].shufflesRemaining--
    },
    extraMove: (_, { game, playerId }) => {
      if (
        playerId !== game.playerIds[game.currentPlayerIndex] ||
        game.players[playerId].extraMovesRemaining <= 0
      ) {
        throw Rune.invalidAction()
      }
      game.movesPerRound++
      game.players[playerId].extraMovesRemaining--
      game.changes = []
    },
    highlight: ({ index }, { game, playerId }) => {
      if (
        playerId === game.playerIds[game.currentPlayerIndex] ||
        index < 0 ||
        index >= game.cells.length
      ) {
        throw Rune.invalidAction()
      }
      if (game.highlightedCells[index] === playerId) {
        delete game.highlightedCells[index]
      } else {
        game.highlightedCells[index] = playerId
      }
      game.changes = []
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      game.playerIds.push(playerId)
      game.players[playerId] = {
        score: game.startingScore,
        shufflesRemaining: numberOfSpecialActions,
        extraMovesRemaining: numberOfSpecialActions,
      }
    },
    playerLeft: (playerId, { game }) => {
      const playerIndex = game.playerIds.indexOf(playerId)
      game.playerIds.splice(playerIndex, 1)
      delete game.players[playerId]
      if (game.currentPlayerIndex === playerIndex) {
        game.currentPlayerIndex--
        advanceToNextPlayer(game)
      } else if (game.currentPlayerIndex > playerIndex) {
        game.currentPlayerIndex--
      }
    },
  },
})
