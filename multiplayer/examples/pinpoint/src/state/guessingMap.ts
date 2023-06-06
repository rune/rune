import { atom } from "jotai"
import { Coordinate } from "ol/coordinate"

export const $pendingGuess = atom<Coordinate | null>(null)

export const $guessingMapView = atom<{
  center: Coordinate
  zoom: number
}>({
  center: [0, 0],
  zoom: 0,
})
