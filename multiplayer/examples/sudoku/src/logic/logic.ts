/* eslint no-undef: 0 */

import { getSudoku } from "sudoku-gen"

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => ({
    sudoku: getSudoku("hard"),
  }),
  actions: {},
  events: {
    playerJoined: () => {},
    playerLeft: () => {},
  },
})
