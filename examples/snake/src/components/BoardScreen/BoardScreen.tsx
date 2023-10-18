import { styled } from "styled-components"
import { InputTracker } from "./InputTracker.tsx"
import { Header } from "../Header/Header.tsx"
import { BoardCanvas } from "./BoardCanvas.tsx"
import { useRef, useState, useEffect } from "react"

export function BoardScreen() {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [canvasContainerSize, setCanvasContainerSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function adjustSize() {
      if (!canvasContainerRef.current) return

      setCanvasContainerSize({
        width: canvasContainerRef.current.clientWidth,
        height: canvasContainerRef.current.clientHeight,
      })
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
          <BoardCanvas
            containerWidth={canvasContainerSize.width}
            containerHeight={canvasContainerSize.height}
          />
        </CanvasContainer>
      </CanvasOuterContainer>
    </>
  )
}

const CanvasOuterContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: relative;
`

const wallSize = 10

const CanvasContainer = styled.div`
  position: absolute;
  left: ${wallSize}px;
  right: ${wallSize}px;
  top: ${wallSize}px;
  bottom: ${wallSize}px;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Wall = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #11d4ff;
  opacity: 0.5;
`
