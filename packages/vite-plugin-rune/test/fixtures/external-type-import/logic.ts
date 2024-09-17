import type { Plugin } from "vite"

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => {
    return { count: 0 as any as Plugin }
  },
  actions: {},
})
