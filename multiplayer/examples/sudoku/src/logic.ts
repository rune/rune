import { getSudoku } from "sudoku-gen"
import { Coordinate, Color, GameState } from "./lib/types/GameState"
import { cellPointer } from "./lib/cellPointer"
import { highlightDuplicates } from "./lib/highlightDuplicates"
import { findDuplicates } from "./lib/findDuplicates"
import { isBoardFilled } from "./lib/isBoardFilled"
import { GameOverOptions } from "rune-games-sdk/multiplayer"
import { getRandomItem } from "./lib/getRandomItem"
import { maxHints } from "./lib/maxHints"
import { range } from "./lib/range"
import { randomString } from "./lib/randomString"

const possibleColors: Color[] = [
  [65, 156, 85],
  [88, 142, 192],
  [224, 190, 70],
  [198, 98, 188],
]

const cornerCells: Coordinate[] = [
  { row: 0, col: 0 },
  { row: 0, col: 8 },
  { row: 8, col: 0 },
  { row: 8, col: 8 },
]

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => ({
    session: randomString(10),
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

      const sudoku = getSudoku(difficulty)

      game.sudoku = {
        difficulty,
        board: sudoku.puzzle.split("").map((value, index) => ({
          value: value === "-" ? null : parseInt(value),
          // TODO: remove, used for testing game over
          // value: parseInt(sudoku.solution[index]),
          valueLock: Math.random(),
          fixed: value !== "-",
          correctValue: parseInt(sudoku.solution[index]),
          error: false,
          lastModifiedByPlayerId: null,
          // TODO: remove, used for testing game over
          // lastModifiedByPlayerId:
          //   value !== "-"
          //     ? null
          //     : Object.keys(game.playerState).sort()[
          //         Math.floor(
          //           Math.random() * Object.keys(game.playerState).length
          //         )
          //       ],
          notes: [],
        })),
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

function calculateErrorsOrGameOver(game: GameState) {
  if (!game.sudoku) throw Rune.invalidAction()

  const duplicates = findDuplicates(game.sudoku.board)
  highlightDuplicates(game.sudoku.board, duplicates)

  if (isBoardFilled(game.sudoku.board) && duplicates.length === 0) {
    game.gameOver = true
    Rune.gameOver({
      players: Object.keys(game.playerState).reduce<GameOverOptions["players"]>(
        (acc, playerId) => ({ ...acc, [playerId]: "WON" }),
        {}
      ),
      delayPopUp: true,
    })
  }
}

function calculateSuccesses(game: GameState, cellCoords: Coordinate) {
  function isCellFilledAndNoError(pointer: Coordinate) {
    const cell = game.sudoku?.board.at(cellPointer(pointer))
    return cell && cell.value && !cell.error
  }

  if (
    range(9).every((row) =>
      isCellFilledAndNoError({ row, col: cellCoords.col })
    )
  ) {
    game.successes.push({ col: cellCoords.col })
  }

  if (
    range(9).every((col) =>
      isCellFilledAndNoError({ row: cellCoords.row, col })
    )
  ) {
    game.successes.push({ row: cellCoords.row })
  }

  const section =
    Math.floor(cellCoords.row / 3) * 3 + Math.floor(cellCoords.col / 3)

  if (
    range(9).every((index) =>
      isCellFilledAndNoError({
        row: Math.floor(section / 3) * 3 + Math.floor(index / 3),
        col: (section % 3) * 3 + (index % 3),
      })
    )
  ) {
    game.successes.push({ section })
  }
}
