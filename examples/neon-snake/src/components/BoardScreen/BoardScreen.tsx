import { styled } from "styled-components"
import { InputTracker } from "./InputTracker.tsx"
import { Header } from "../Header/Header.tsx"
import { BoardCanvas } from "./BoardCanvas.tsx"
import { useEffect, useRef, useState } from "react"
import { boardSize } from "../../logic/logicConfig.ts"

export function BoardScreen() {
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const [canvasScale, setCanvasScale] = useState(1)
  const [renderCanvas, setRenderCanvas] = useState(false)

  useEffect(() => {
    function adjustSize() {
      if (!canvasContainerRef.current) return

      const containerWidth = canvasContainerRef.current.clientWidth
      const containerHeight = canvasContainerRef.current.clientHeight

      const widthScale = containerWidth / boardSize.width
      const heightScale = containerHeight / boardSize.height

      const newScale = Math.min(widthScale, heightScale)

      setCanvasScale(newScale > 0 ? newScale : 1)
      setRenderCanvas(true)
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
        <CanvasContainer ref={canvasContainerRef}>
          {renderCanvas && <BoardCanvas scale={canvasScale} />}
        </CanvasContainer>
      </CanvasOuterContainer>
    </>
  )
}

const CanvasOuterContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: relative;
  background-color: black;
`

const minWallSize = 5

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
