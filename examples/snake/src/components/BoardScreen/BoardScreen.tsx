import { styled } from "styled-components"
import { InputTracker } from "./InputTracker.tsx"
import { Header } from "../Header.tsx"
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
      <CanvasContainer ref={canvasContainerRef}>
        <BoardCanvas
          containerWidth={canvasContainerSize.width}
          containerHeight={canvasContainerSize.height}
        />
      </CanvasContainer>
    </>
  )
}

const CanvasContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  overflow: hidden;
  background: blue;
`
