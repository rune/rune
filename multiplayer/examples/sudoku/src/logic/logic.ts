import { getSudoku } from "sudoku-gen"
import { Coordinate, Color, Cell } from "./types/GameState"
import { cellPointer } from "../lib/cellPointer"

const possibleColors: Color[] = [
  [65, 156, 85],
  [88, 142, 192],
  [209, 122, 42],
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
    sudoku: null,
    playerState: playerIds.reduce(
      (acc, playerId, index) => ({
        ...acc,
        [playerId]: {
          color: possibleColors[index],
          selection: cornerCells[index],
        },
      }),
      {}
    ),
  }),
  actions: {
    startGame: (difficulty, { game }) => {
      if (game.sudoku) throw Rune.invalidAction()

      const sudoku = getSudoku(difficulty)

      const board: Cell[] = sudoku.puzzle.split("").map((value, index) => ({
        value: value === "-" ? null : parseInt(value),
        valueAge: 0,
        fixed: value !== "-",
        correctValue: parseInt(sudoku.solution[index]),
      }))

      game.sudoku = {
        difficulty,
        board,
      }
    },
    select: (coordinate, { game, playerId }) => {
      if (!game.sudoku) throw Rune.invalidAction()

      game.playerState[playerId].selection = coordinate
    },
    setValue: ({ value, assumedValueAge }, { game, playerId }) => {
      if (!game.sudoku) throw Rune.invalidAction()

      const selection = game.playerState[playerId].selection
      const cell = game.sudoku.board[cellPointer(selection)]

      if (cell.fixed) throw Rune.invalidAction()

      if (cell.valueAge !== assumedValueAge) throw Rune.invalidAction()

      cell.value = value
      cell.valueAge++
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
