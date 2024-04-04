// eslint-disable-next-line
//@ts-ignore
import sum from "math-sum"
import data from "./data.json"

Dusk.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => {
    return { count: sum([data.x, 2, 3]) }
  },
  actions: {},
})
