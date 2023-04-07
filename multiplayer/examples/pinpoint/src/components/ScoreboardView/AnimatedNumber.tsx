import { useState, useRef, useEffect } from "react"
import { timings } from "../animation/config"

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

export function AnimatedNumber({ value }: { value: number }) {
  const [renderedValue, setRenderedValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current === value) return
    const duration = timings.scoreIncrement
    const oldValue = prevValue.current

    prevValue.current = value

    let handle = requestAnimationFrame(tick)
    let start = Date.now()

    function tick() {
      setRenderedValue(() => {
        const newValue =
          oldValue +
          easeOutExpo((Date.now() - start) / duration) * (value - oldValue)

        if (newValue >= value) {
          return value
        }

        handle = requestAnimationFrame(tick)
        return Math.round(newValue)
      })
    }

    return () => cancelAnimationFrame(handle)
  }, [value])

  return <>{renderedValue}</>
}
