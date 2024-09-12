import { useAtomValue } from "jotai"
import { useState, useEffect } from "react"
import { $ready } from "../../state/state.ts"

// https://stackoverflow.com/a/4819886
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.maxTouchPoints > 0
  )
}

export function InputTracker() {
  const ready = useAtomValue($ready)
  const [leftPressed, setLeftPressed] = useState(false)
  const [rightPressed, setRightPressed] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "ArrowLeft") setLeftPressed(true)
      if (e.code === "ArrowRight") setRightPressed(true)
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "ArrowLeft") setLeftPressed(false)
      if (e.code === "ArrowRight") setRightPressed(false)
    }

    function onTouch(e: TouchEvent) {
      e.preventDefault()
      const touches = [...e.touches]
      setRightPressed(touches.some((t) => t.clientX > window.innerWidth / 2))
      setLeftPressed(touches.some((t) => t.clientX < window.innerWidth / 2))
    }

    function onMouseDown(e: MouseEvent) {
      setRightPressed(e.clientX > window.innerWidth / 2)
      setLeftPressed(e.clientX < window.innerWidth / 2)
    }

    function onMouseUp() {
      setRightPressed(false)
      setLeftPressed(false)
    }

    document.body.addEventListener("keydown", onKeyDown)
    document.body.addEventListener("keyup", onKeyUp)
    if (isTouchDevice()) {
      document.body.addEventListener("touchstart", onTouch)
      document.body.addEventListener("touchend", onTouch)
    } else {
      document.body.addEventListener("mousedown", onMouseDown)
      document.body.addEventListener("mouseup", onMouseUp)
    }

    return () => {
      document.body.removeEventListener("keydown", onKeyDown)
      document.body.removeEventListener("keyup", onKeyUp)
      if (isTouchDevice()) {
        document.body.removeEventListener("touchstart", onTouch)
        document.body.removeEventListener("touchend", onTouch)
      } else {
        document.body.removeEventListener("mousedown", onMouseDown)
        document.body.removeEventListener("mouseup", onMouseUp)
      }
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    if (leftPressed && !rightPressed) Rune.actions.setTurning("left")
    else if (rightPressed && !leftPressed) Rune.actions.setTurning("right")
    else Rune.actions.setTurning("none")
  }, [ready, leftPressed, rightPressed])

  return null
}
