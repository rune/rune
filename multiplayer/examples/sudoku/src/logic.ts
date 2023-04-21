import { getSudoku } from "sudoku-gen"
import { Coordinate, Color, GameState } from "./lib/types/GameState"
import { cellPointer } from "./lib/cellPointer"
import { highlightDuplicates } from "./lib/highlightDuplicates"
import { findDuplicates } from "./lib/findDuplicates"
import { isBoardFilled } from "./lib/isBoardFilled"
import { GameOverOptions } from "rune-games-sdk/multiplayer"

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
        })),
      }
    },
    select: (coordinate, { game, playerId }) => {
      if (!game.sudoku) throw Rune.invalidAction()

      game.playerState[playerId].selection = coordinate
    },
    setValue: ({ value, clientValueLock }, { game, playerId }) => {
      if (!game.sudoku) throw Rune.invalidAction()

      const selection = game.playerState[playerId].selection
      const cell = game.sudoku.board[cellPointer(selection)]

      if (cell.fixed) throw Rune.invalidAction()
      if (cell.valueLock !== clientValueLock) throw Rune.invalidAction()

      cell.value = value
      cell.valueLock = Math.random()
      cell.lastModifiedByPlayerId = playerId

      const duplicates = findDuplicates(game.sudoku.board)
      highlightDuplicates(game.sudoku.board, duplicates)

      if (isBoardFilled(game.sudoku.board) && duplicates.length === 0) {
        game.gameOver = true
        Rune.gameOver({
          players: Object.keys(game.playerState).reduce<
            GameOverOptions["players"]
          >((acc, playerId) => ({ ...acc, [playerId]: "WON" }), {}),
        })
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
