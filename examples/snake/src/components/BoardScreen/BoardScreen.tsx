import { styled } from "styled-components"
import { InputTracker } from "./InputTracker.tsx"
import { Header } from "../Header/Header.tsx"
import { BoardCanvas } from "./BoardCanvas.tsx"
import { useRef, useState, useEffect } from "react"
import backgroundGridCell from "./backgroundGridCell.png"
import { boardSize } from "../../logic/logicConfig.ts"

export function BoardScreen() {
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const [canvasScale, setCanvasScale] = useState(1)

  useEffect(() => {
    function adjustSize() {
      if (!canvasContainerRef.current) return

      const containerWidth = canvasContainerRef.current.clientWidth
      const containerHeight = canvasContainerRef.current.clientHeight

      const widthScale = containerWidth / boardSize.width
      const heightScale = containerHeight / boardSize.height

      const newScale = Math.min(widthScale, heightScale)

      setCanvasScale(newScale > 0 ? newScale : 1)
    }

    adjustSize()

    window.addEventListener("resize", adjustSize)

    return () => window.removeEventListener("resize", adjustSize)
  }, [])

  return (
    <>
      <InputTracker />
      <Header />
      <CanvasOuterContainer>
        <Wall />
        <CanvasContainer ref={canvasContainerRef}>
          <BoardCanvas scale={canvasScale} />
        </CanvasContainer>
      </CanvasOuterContainer>
    </>
  )
}

const horizontalCellCount = 23
const cellSizePx = 17
const cellBorderPx = 0.68
const cellSizeVw = (1 / horizontalCellCount) * 100
const cellSizeWithNextBorderVw =
  cellSizeVw - ((cellSizeVw / cellSizePx) * cellBorderPx) / horizontalCellCount

const CanvasOuterContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: relative;
  background:
    url("${backgroundGridCell}") repeat left top / ${cellSizeWithNextBorderVw}vw
      ${cellSizeWithNextBorderVw}vw,
    black;
`

const wallSize = 10

const CanvasContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: ${wallSize}px solid rgba(17, 212, 255, 0.5);
  box-sizing: content-box;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Wall = styled.div`
  position: absolute;
  left: ${wallSize}px;
  right: ${wallSize}px;
  top: ${wallSize}px;
  bottom: ${wallSize}px;
  background-color: rgba(17, 212, 255, 0.5);
`
