import { Coordinate, Color, GameState } from "./lib/types/GameState"
import { cellPointer } from "./lib/cellPointer"
import { getRandomItem } from "./lib/getRandomItem"
import { maxHints } from "./lib/maxHints"
import { randomString } from "./lib/randomString"
import { calculateErrorsOrGameOver } from "./lib/calculateErrorsOrGameOver"
import { calculateSuccesses } from "./lib/calculateSuccesses"
import { generateSudoku } from "./lib/generateSudoku"

const possibleColors: Color[] = [
  [65, 156, 85],
  [88, 142, 192],
  [224, 190, 70],
  [198, 98, 188],
  [190, 30, 30],
  [130, 30, 190],
]

const cornerCells: Coordinate[] = [
  { row: 0, col: 0 },
  { row: 0, col: 8 },
  { row: 8, col: 0 },
  { row: 8, col: 8 },
  { row: 3, col: 3 },
  { row: 5, col: 5 },
]

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 6,
  persistPlayerData: true,
  setup: (playerIds) => ({
    session: randomString(10),
    onboardingBoard: generateSudoku({
      difficulty: "medium",
      solved: true,
    }),
    gameOver: false,
    sudoku: null,
    playerState: playerIds.reduce<GameState["playerState"]>(
      (acc, playerId, index) => ({
        ...acc,
        [playerId]: {
          color: possibleColors[index],
          selection: cornerCells[index],
        },
      }),
      {}
    ),
    hints: [],
    successes: [],
  }),
  actions: {
    startGame: (difficulty, { game }) => {
      if (game.sudoku) throw Rune.invalidAction()

      game.sudoku = {
        difficulty,
        board: generateSudoku({ difficulty, solved: false }),
      }
    },
    select: (coordinate, { game, playerId }) => {
      if (!game.sudoku) throw Rune.invalidAction()
      if (!game.sudoku.board.at(cellPointer(coordinate)))
        throw Rune.invalidAction()

      game.playerState[playerId].selection = coordinate
    },
    setValue: ({ value, clientValueLock }, { game, playerId }) => {
      if (!game.sudoku) throw Rune.invalidAction()

      const selection = game.playerState[playerId].selection
      const cell = game.sudoku.board.at(cellPointer(selection))

      if (!cell) throw Rune.invalidAction()
      if (cell.fixed) throw Rune.invalidAction()
      if (cell.valueLock !== clientValueLock) throw Rune.invalidAction()

      cell.value = value
      cell.valueLock = Math.random()
      cell.lastModifiedByPlayerId = playerId
      cell.notes = []

      calculateErrorsOrGameOver(game)
      calculateSuccesses(game, selection)
    },
    showHint: (_, { game }) => {
      if (!game.sudoku) throw Rune.invalidAction()
      if (game.hints.length === maxHints) throw Rune.invalidAction()

      const emptyOrIncorrectCell = getRandomItem(
        game.sudoku.board.filter(
          (cell) => !cell.value || cell.value !== cell.correctValue
        )
      )

      if (!emptyOrIncorrectCell) return

      emptyOrIncorrectCell.value = emptyOrIncorrectCell.correctValue
      emptyOrIncorrectCell.fixed = true
      emptyOrIncorrectCell.lastModifiedByPlayerId = null
      emptyOrIncorrectCell.notes = []
      game.hints.push(
        cellPointer(game.sudoku.board.indexOf(emptyOrIncorrectCell))
      )

      calculateErrorsOrGameOver(game)
      calculateSuccesses(
        game,
        cellPointer(game.sudoku.board.indexOf(emptyOrIncorrectCell))
      )
    },
    toggleNote: ({ value }, { game, playerId }) => {
      if (!game.sudoku) throw Rune.invalidAction()

      const selection = game.playerState[playerId].selection
      const cell = game.sudoku.board.at(cellPointer(selection))

      if (!cell) throw Rune.invalidAction()
      if (cell.value) throw Rune.invalidAction()

      if (value === null) {
        cell.notes = []
      } else {
        cell.notes = cell.notes.includes(value)
          ? cell.notes.filter((note) => note !== value)
          : [...cell.notes, value]
      }
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      const freeColor = possibleColors.find(
        (possibleColor) =>
          !Object.values(game.playerState).find(
            ({ color }) =>
              color[0] === possibleColor[0] &&
              color[1] === possibleColor[1] &&
              color[2] === possibleColor[2]
          )
      )

      const freeCornerCell = cornerCells.find(
        (cornerCell) =>
          !Object.values(game.playerState).find(
            ({ selection }) =>
              selection.row === cornerCell.row &&
              selection.col === cornerCell.col
          )
      )

      if (!freeColor || !freeCornerCell)
        throw new Error("Couldn't find free color or free corner cell")

      game.playerState[playerId] = {
        color: freeColor,
        selection: freeCornerCell,
      }
    },
    playerLeft: (playerId, { game }) => {
      delete game.playerState[playerId]
    },
  },
})
