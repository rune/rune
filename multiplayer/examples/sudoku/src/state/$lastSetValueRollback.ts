import { atom } from "jotai"

export const $lastSetValueRollback = atom<Date | null>(null)
