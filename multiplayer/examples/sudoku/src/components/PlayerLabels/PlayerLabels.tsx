import styled from "styled-components/macro"
import { useRef } from "react"
import { Label } from "./Label"
import { useLabelMap } from "./useLabelMap"
import { usePositionedLabelMap } from "./usePositionedLabelMap"
import { useAtomValue } from "jotai"
import { $gameOver } from "../../state/$game"

export function PlayerLabels() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { labelMap, setLabelMap } = useLabelMap()
  const { positionedLabelMap } = usePositionedLabelMap(labelMap)
  const gameOver = useAtomValue($gameOver)

  if (gameOver) return null

  return (
    <Root ref={rootRef}>
      {Object.entries(positionedLabelMap).map(
        ([playerId, { color, position, direction }], i) => (
          <Label
            key={playerId}
            playerId={playerId}
            color={color}
            x={position.x}
            y={position.y}
            direction={direction}
            onSizeChanged={(width, height) => {
              setLabelMap((labelMap) => ({
                ...labelMap,
                [playerId]: { ...labelMap[playerId], width, height },
              }))
            }}
          />
        )
      )}
    </Root>
  )
}

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`
