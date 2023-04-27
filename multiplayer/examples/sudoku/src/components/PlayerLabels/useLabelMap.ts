import { useAtomValue } from "jotai"
import { $playerState } from "../../state/$game"
import { useState, useEffect } from "react"
import { LabelMap } from "./types"
import { $boardRef } from "../../state/$boardRef"

export function useLabelMap() {
  const playerState = useAtomValue($playerState)
  const [labelMap, setLabelMap] = useState<LabelMap>({})
  const boardRef = useAtomValue($boardRef)

  useEffect(() => {
    if (!playerState) return

    setLabelMap((labelMap) =>
      Object.keys(playerState).reduce<LabelMap>((acc, playerId) => {
        const cell = playerState[playerId].selection
        const color = playerState[playerId].color
        const cellRect = boardRef
          ?.querySelector(`[data-pointer="cell-${cell.row}-${cell.col}"]`)
          ?.getBoundingClientRect()
        const currentValue = labelMap[playerId]

        return cellRect
          ? {
              ...acc,
              [playerId]: {
                playerId,
                color,
                cellRect,
                width: currentValue?.width ?? 0,
                height: currentValue?.height ?? 0,
                position: { x: -1000, y: -1000 },
                direction: "left",
              },
            }
          : acc
      }, {})
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef, JSON.stringify(playerState)])

  return { labelMap, setLabelMap }
}
