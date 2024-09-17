import type { PlayerId } from "rune-sdk/multiplayer"
import {
  areCellsNeighbors,
  getCoordinatesForIndex,
  getIndexForCoordinates,
} from "./board"
import { cols, numberOfRounds, numberOfTiles, rows } from "./config"
import type {
  BoardChange,
  Cells,
  GameState,
  MaybeCells,
  PlayersState,
} from "../types"

export const getRandomTile = () => Math.ceil(Math.random() * numberOfTiles)

function seekMatchBoundary(
  cells: Cells,
  originIndex: number,
  step: number,
  shouldSeekHorizontally: boolean
) {
  let current = originIndex
  const tile = cells[originIndex] % numberOfTiles
  while (true) {
    const next = current + step
    if (
      (shouldSeekHorizontally
        ? Math.floor(next / cols) === Math.floor(originIndex / cols)
        : next % cols === originIndex % cols) &&
      next in cells &&
      cells[next] % numberOfTiles === tile
    ) {
      current = next
    } else {
      break
    }
  }
  return current
}

export function seekMatch3(
  cells: Cells,
  originIndex: number,
  shouldSeekHorizontally: boolean
) {
  const stepSize = shouldSeekHorizontally ? 1 : cols
  const startIndex = seekMatchBoundary(
    cells,
    originIndex,
    0 - stepSize,
    shouldSeekHorizontally
  )
  const endIndex = seekMatchBoundary(
    cells,
    originIndex,
    stepSize,
    shouldSeekHorizontally
  )
  const matchCount = (endIndex - startIndex) / stepSize + 1
  return matchCount >= 3
}

export function match3(cells: Cells) {
  const clusters: number[][] = []
  for (let row = 0; row < rows; row++) {
    let cluster = []
    for (let col = 0; col < cols; col++) {
      const index = getIndexForCoordinates(row, col)
      if (
        cluster.length !== 0 &&
        cells[cluster[0]] % numberOfTiles !== cells[index] % numberOfTiles
      ) {
        cluster = []
      }
      cluster.push(index)
      if (cluster.length === 3) {
        clusters.push(cluster)
      }
    }
  }

  for (let col = 0; col < cols; col++) {
    let cluster: number[] = []
    for (let row = 0; row < rows; row++) {
      const index = getIndexForCoordinates(row, col)
      if (
        cluster.length !== 0 &&
        cells[cluster[0]] % numberOfTiles !== cells[index] % numberOfTiles
      ) {
        cluster = []
      }
      cluster.push(index)
      if (cluster.length === 3) {
        clusters.push(cluster)
      }
    }
  }

  return clusters.reduce((acc, current) => {
    for (const item of acc) {
      for (const index of current) {
        if (item.includes(index)) {
          item.push(...current.filter((i) => i !== index))
          item.sort((a, b) => a - b)
          return acc
        }
      }
    }
    acc.push(current)
    return acc
  }, [] as number[][])
}

function removeIndices(cells: MaybeCells, indices: number[]) {
  const moved: Record<number, number> = {}
  for (const index of indices) {
    let current = index
    while (true) {
      const parent = current - cols
      if (parent >= 0 && cells[parent] !== null) {
        cells[current] = cells[parent]
        cells[parent] = null
        if (parent in moved) {
          moved[current] = moved[parent]
          delete moved[parent]
        } else {
          moved[current] = parent
        }
        current = parent
      } else {
        cells[current] = null
        break
      }
    }
  }
  return moved
}

function fillEmptyIndices(cells: MaybeCells) {
  const added: Record<number, number> = {}
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === null) {
      const tile = getRandomTile()
      cells[i] = tile
      added[i] = tile
    }
  }
  return added
}

function swapIndices(cells: Cells, sourceIndex: number, targetIndex: number) {
  const sourceTile = cells[sourceIndex]
  cells[sourceIndex] = cells[targetIndex]
  cells[targetIndex] = sourceTile
  return cells
}

export const swapAndMatch = (
  cells: Cells,
  sourceIndex: number,
  targetIndex: number
) => {
  swapIndices(cells, sourceIndex, targetIndex)
  const changes: BoardChange[] = []
  let firstPass = true
  while (true) {
    const clusters = match3(cells)
    if (clusters.length === 0) {
      break
    }
    const removed = clusters.filter((arr) => arr.length <= 3)
    const indicesToRemove = removed
      .flat()
      .filter((t, i, arr) => arr.indexOf(t) === i)
    const cleared = []
    const triggered = clusters.flat()
    for (const index of triggered) {
      const tile = cells[index]
      let indices
      switch (Math.floor((tile - 1) / numberOfTiles)) {
        // Horizontal arrow
        case 1: {
          indices = new Array(cols)
            .fill(Math.floor(index / cols) * cols)
            .map((start, i) => start + i)
          break
        }
        // Vertical arrow
        case 2: {
          indices = new Array(cols)
            .fill(index % cols)
            .map((start, i) => start + cols * i)
          break
        }
        // Bomb
        case 3: {
          indices = [
            index,
            index - 1, // left
            index + 1, // right
            index - cols, // top
            index + cols, // bottom
            index - cols - 1, // top left
            index - cols + 1, // top right
            index + cols - 1, // bottom left
            index + cols + 1, // bottom right
          ].filter((value, _i, arr) => {
            const c1 = getCoordinatesForIndex(value)
            const c2 = getCoordinatesForIndex(arr[0])
            return (
              value >= 0 &&
              value < cols * rows &&
              Math.abs(c1.row - c2.row) <= 1 &&
              Math.abs(c1.col - c2.col) <= 1
            )
          })
          break
        }
        default: {
          continue
        }
      }
      cleared.push({ tile, index, indices })
      indicesToRemove.push(...indices)
      for (const i of indices) {
        if (cells[i] >= numberOfTiles && !triggered.includes(i)) {
          triggered.push(i)
        }
      }
    }
    // These are special tiles that either become line clearers or bombs
    const merged: {
      index: number
      tile: number
      vertical: boolean
      indices: number[]
    }[] = []
    for (const arr of clusters.filter((arr) => arr.length > 3)) {
      const isVertical =
        arr.findIndex(
          (index, i, arr) => i !== 0 && index - arr[i - 1] !== cols
        ) === -1
      const mergedIndex = isVertical
        ? arr[arr.length - 1]
        : firstPass && arr.includes(sourceIndex)
          ? sourceIndex
          : firstPass && arr.includes(targetIndex)
            ? targetIndex
            : arr[Math.floor(arr.length / 2)]
      cells[mergedIndex] =
        ((cells[mergedIndex] - 1) % numberOfTiles) +
        1 +
        (arr.length === 4 ? (isVertical ? 2 : 1) : 3) * numberOfTiles
      if (indicesToRemove.includes(mergedIndex)) {
        indicesToRemove.splice(indicesToRemove.indexOf(mergedIndex), 1)
      }

      arr.splice(arr.indexOf(mergedIndex), 1)
      merged.push({
        index: mergedIndex,
        tile: cells[mergedIndex],
        vertical: isVertical,
        indices: arr,
      })
      indicesToRemove.push(...arr)
    }

    const moved = removeIndices(
      cells,
      indicesToRemove
        .filter((t, i, arr) => arr.indexOf(t) === i)
        .sort((a, b) => a - b)
    )
    const added = fillEmptyIndices(cells)
    changes.push({ removed, merged, cleared, moved, added })
    firstPass = false
  }
  return changes
}

export function shuffle(sourceCells: Cells) {
  let moved: Record<number, number>, cells: Cells
  do {
    moved = {}
    cells = sourceCells.slice(0)
    const unswappedIndices = new Array(cells.length).fill(null).map((_, i) => i)
    while (unswappedIndices.length > 1) {
      const sourceIndex = unswappedIndices.splice(
        Math.floor(Math.random() * unswappedIndices.length),
        1
      ) as unknown as number // types are wrong
      const targetIndex = unswappedIndices.splice(
        Math.floor(Math.random() * unswappedIndices.length),
        1
      ) as unknown as number
      swapIndices(cells, sourceIndex, targetIndex)
      moved[sourceIndex] = targetIndex
      moved[targetIndex] = sourceIndex
    }
  } while (match3(cells).length !== 0 || !hasValidMoves(cells))
  return { moved, cells }
}

export function getScoreForChange({ removed, merged, cleared }: BoardChange) {
  const clusters = removed.concat(
    merged.map(({ index, indices }) => [index].concat(indices))
  )
  const matched = clusters.flat()
  let sum = clusters.reduce((sum, cluster) => sum + cluster.length ** 2, 0)
  for (const index of cleared
    .map(({ indices }) => indices)
    .flat()
    .filter((t, i, arr) => arr.indexOf(t) === i)) {
    if (!matched.includes(index)) {
      sum += 3
    }
  }
  return sum
}

export const getScoreForChanges = (changes: BoardChange[]) =>
  changes.map((change) => getScoreForChange(change)).reduce((a, b) => a + b, 0)

export const getScores = (players: PlayersState) =>
  Object.entries(players).reduce(
    (acc, [id, player]) => {
      acc[id] = player.score
      return acc
    },
    {} as Record<PlayerId, number>
  )

export const isGameOver = (game: GameState) =>
  game.roundsPlayed >= numberOfRounds

export function isValidMove(cells: Cells, index1: number, index2: number) {
  if (!areCellsNeighbors(index1, index2)) {
    return false
  }
  const swapped = swapIndices(cells.slice(0), index1, index2)
  return (
    seekMatch3(swapped, index1, false) ||
    seekMatch3(swapped, index1, true) ||
    seekMatch3(swapped, index2, false) ||
    seekMatch3(swapped, index2, true)
  )
}

export function hasValidMoves(cells: Cells) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = getIndexForCoordinates(row, col)
      if (
        isValidMove(cells, index, index + 1) ||
        isValidMove(cells, index, index + cols)
      ) {
        return true
      }
    }
  }
  return false
}
