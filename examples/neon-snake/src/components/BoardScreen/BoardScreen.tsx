import { styled } from "styled-components"
import { InputTracker } from "./InputTracker.tsx"
import { Header } from "../Header/Header.tsx"
import { BoardCanvas } from "./BoardCanvas.tsx"
import { useRef, useState, useEffect, useMemo } from "react"
import { boardSize } from "../../logic/logicConfig.ts"
import { gridBackground } from "../../lib/gridBackground.ts"

export function BoardScreen({ minimalUI }: { minimalUI: boolean }) {
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const [canvasScale, setCanvasScale] = useState(1)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    function adjustSize() {
      if (!canvasContainerRef.current) return

      const containerWidth = canvasContainerRef.current.clientWidth
      const containerHeight = canvasContainerRef.current.clientHeight

      const widthScale = containerWidth / boardSize.width
      const heightScale = containerHeight / boardSize.height

      const newScale = Math.min(widthScale, heightScale)

      setCanvasScale(newScale > 0 ? newScale : 1)
      setContainerWidth(containerWidth)
      setContainerHeight(containerHeight)
    }

    adjustSize()

    window.addEventListener("resize", adjustSize)

    return () => window.removeEventListener("resize", adjustSize)
  }, [])

  const borderWidth = useMemo(() => {
    const horizontalWallSize =
      (containerHeight - boardSize.height * canvasScale) / 2 + minWallSize
    const verticalWallSize =
      (containerWidth - boardSize.width * canvasScale) / 2 + minWallSize

    return `${horizontalWallSize}px ${verticalWallSize}px`
  }, [canvasScale, containerHeight, containerWidth])

  return (
    <>
      <InputTracker />
      <Header hidden={minimalUI} />
      <CanvasOuterContainer>
        <Wall style={{ borderWidth }} $hidden={minimalUI} />
        <CanvasContainer ref={canvasContainerRef}>
          <BoardCanvas scale={canvasScale} />
        </CanvasContainer>
      </CanvasOuterContainer>
    </>
  )
}

const CanvasOuterContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: relative;
  ${gridBackground};
`

const minWallSize = 10

const CanvasContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: ${minWallSize}px solid transparent;
  box-sizing: content-box;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Wall = styled.div<{ $hidden: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 1);
  visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};
`
