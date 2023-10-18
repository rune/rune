import { useAtomValue } from "jotai"
import { useState, useEffect } from "react"
import { $ready } from "../../state/state.ts"

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
      const touches = [...e.touches]

      setRightPressed(touches.some((t) => t.clientX > window.innerWidth / 2))
      setLeftPressed(touches.some((t) => t.clientX < window.innerWidth / 2))
    }

    document.body.addEventListener("keydown", onKeyDown)
    document.body.addEventListener("keyup", onKeyUp)
    document.body.addEventListener("touchstart", onTouch)
    document.body.addEventListener("touchend", onTouch)

    return () => {
      document.body.removeEventListener("keydown", onKeyDown)
      document.body.removeEventListener("keyup", onKeyUp)
      document.body.removeEventListener("touchstart", onTouch)
      document.body.removeEventListener("touchend", onTouch)
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
