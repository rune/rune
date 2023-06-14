import { cols, rows } from "./config"

export function getCoordinatesForIndex(index: number) {
  const row = Math.floor(index / cols)
  const col = index % cols
  return { row, col }
}

export const areCoordinatesValid = (row: number, col: number) =>
  row >= 0 && row < rows && col >= 0 && col < cols

export function getIndexForCoordinates(row: number, col: number) {
  if (!areCoordinatesValid(row, col)) {
    throw new Error("Out of bounds")
  }
  return row * cols + col
}

export function areCellsNeighbors(index1: number, index2: number) {
  const colDelta = Math.abs(index1 - index2)
  return (
    ((colDelta === 1 &&
      Math.floor(index1 / cols) === Math.floor(index2 / cols)) ||
      (colDelta === cols && index1 % cols === index2 % cols)) &&
    Math.min(index1, index2) >= 0 &&
    Math.max(index1, index2) < cols * rows
  )
}
