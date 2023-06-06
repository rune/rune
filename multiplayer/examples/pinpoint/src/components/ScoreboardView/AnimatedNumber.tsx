import { useState, useRef, useEffect } from "react"
import { timings } from "../animation/config"
import { animate } from "../../lib/animate"

export function AnimatedNumber({ value }: { value: number }) {
  const [renderedValue, setRenderedValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current === value) return
    const oldValue = prevValue.current
    prevValue.current = value

    const dispose = animate(0, timings.scoreIncrement, (step) => {
      setRenderedValue(
        oldValue + Math.round(easeOutExpo(step) * (value - oldValue))
      )
    })

    return () => dispose()
  }, [value])

  return <>{renderedValue}</>
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}
