import { atom } from "jotai"

export const $animatingHints = atom<{ [cellIndex: number]: boolean }>({})
