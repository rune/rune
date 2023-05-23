import { atom } from "jotai"

export const $lastPlayerActivity = atom<{ [playerId: string]: Date }>({})
