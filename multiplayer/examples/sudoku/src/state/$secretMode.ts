import { atom, useSetAtom } from "jotai"
import { useEffect, useState, useRef } from "react"

export const $secretMode = atom(false)
const lock = [4, 3, 4]

export function useSecretModeTrigger() {
  const setSecretMode = useSetAtom($secretMode)

  const touchCounter = useRef(0)
  const [touches, setTouches] = useState<number[]>([])

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      touchCounter.current = e.touches.length
    }

    function onTouchEnd() {
      const currentCount = touchCounter.current
      if (currentCount === 0) return
      touchCounter.current = 0
      setTouches((prev) => [...prev, currentCount].slice(-3))
    }

    document.addEventListener("touchstart", onTouchStart)
    document.addEventListener("touchend", onTouchEnd)

    return () => {
      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  useEffect(() => {
    if (touches.length === 3 && touches.every((t, i) => t === lock[i])) {
      setSecretMode((prev) => !prev)
    }
  }, [setSecretMode, touches])
}
