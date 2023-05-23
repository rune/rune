import { Coordinate } from "./types/GameState"

export function cellPointer(coordinate: Coordinate): number
export function cellPointer(index: number): Coordinate
export function cellPointer(coordinateOrIndex: Coordinate | number) {
  return typeof coordinateOrIndex === "number"
    ? { row: Math.floor(coordinateOrIndex / 9), col: coordinateOrIndex % 9 }
    : coordinateOrIndex.row * 9 + coordinateOrIndex.col
}
