import { atom } from "jotai"

export const $inputMode = atom<"value" | "note">("value")
