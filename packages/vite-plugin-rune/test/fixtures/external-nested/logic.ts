import { helpers } from "./shared/helpers.js"

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => {
    return { count: 0 }
  },
  actions: {
    increment: ({ amount }: any, { game }: any) => {
      console.log(helpers.deep)
      game.count += amount
    },
  },
})
