// eslint-disable-next-line
//@ts-ignore
import { equals } from "./a"

export function add(a: number, b: number) {
  return a + b
}

Dusk.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => {
    return { count: equals() }
  },
  actions: {},
})
