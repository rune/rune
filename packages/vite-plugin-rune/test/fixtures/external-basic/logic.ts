// eslint-disable-next-line
//@ts-ignore
import sum from "math-sum"

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => {
    return { count: sum([1, 2, 3]) }
  },
  actions: {},
})
