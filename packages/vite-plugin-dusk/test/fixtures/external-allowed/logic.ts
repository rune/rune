//@ts-ignore
import { getSudoku } from "sudoku-gen"
//@ts-ignore
import { getSudoku as inner } from "sudoku-gen/dist/index.js"

Dusk.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => {
    return { count: getSudoku(), y: inner() }
  },
  actions: {},
})
