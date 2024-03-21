// eslint-disable-next-line
//@ts-ignore
import { getSudoku } from "sudoku-gen"

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => {
    return { count: getSudoku() }
  },
  actions: {},
})
