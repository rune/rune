import { LabelMap, LabelDefinition, Rect, Direction } from "./types"
import { useMemo } from "react"
import { cornerCombinations } from "./corners"
import { getCornerPositionAndDirection } from "./getCornerPositionAndDirection"
import { getEstimatedRect } from "./getEstimatedRect"
import { checkRectsIntersect } from "./checkRectsIntersect"
import { checkRectOutOfBounds } from "./checkRectOutOfBounds"

interface Position {
  label: LabelDefinition
  rect: Rect
  corner: { x: number; y: number }
  direction: Direction
}

export function usePositionedLabelMap(labelMap: LabelMap) {
  const positionedLabelMap = useMemo(() => {
    const labels = Object.values(labelMap)

    const positionCombinations: {
      positions: Position[]
      cost: number
    }[] = []

    for (const [c1, c2, c3, c4] of cornerCombinations) {
      const positions: Position[] = []

      for (let i = 0; i < labels.length; i++) {
        const label = labels[i]

        const { corner, direction } = getCornerPositionAndDirection(
          label,
          i === 0 ? c1 : i === 1 ? c2 : i === 2 ? c3 : c4
        )
        const rect = getEstimatedRect(label, { corner, direction })

        positions.push({ label, rect, corner, direction })
      }

      let cost = 0

      for (const position of positions) {
        const largerRect = {
          ...position.rect,
          width: position.rect.width + position.label.cellRect.width,
        }
        const otherPositions = positions.filter((p) => p !== position)

        if (checkRectOutOfBounds(position.rect)) {
          cost += 100
        }

        for (const otherPosition of otherPositions) {
          if (
            position.corner.x === otherPosition.corner.x &&
            position.corner.y === otherPosition.corner.y
          ) {
            cost += 1000
          }

          if (checkRectsIntersect(position.rect, otherPosition.rect)) {
            cost += 10
          }

          if (checkRectsIntersect(largerRect, otherPosition.rect)) {
            cost += 10
          }

          if (
            checkRectsIntersect(position.rect, otherPosition.label.cellRect)
          ) {
            cost += 1
          }
        }
      }

      positionCombinations.push({ positions, cost })
    }

    let minCost = Infinity
    let bestCombination: (typeof positionCombinations)[number] | undefined =
      undefined

    for (const combination of positionCombinations) {
      if (combination.cost < minCost) {
        minCost = combination.cost
        bestCombination = combination
        if (combination.cost === 0) break
      }
    }

    const positionedLabelMap = { ...labelMap }

    bestCombination?.positions.forEach((p) => {
      positionedLabelMap[p.label.playerId] = {
        ...labelMap[p.label.playerId],
        position: p.corner,
        direction: p.direction,
      }
    })

    return positionedLabelMap
  }, [labelMap])

  return { positionedLabelMap }
}
