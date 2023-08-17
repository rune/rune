import { useState, useEffect } from "react"

export function useTimerValue({
  startedAt,
  duration,
}: {
  startedAt?: number
  duration: number
}) {
  const [value, setValue] = useState<number | null>(null)

  useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined

    if (startedAt) {
      const adjustedStartedAt =
        Date.now() - (Rune.gameTimeInSeconds() - startedAt) * 1000

      const tick = () => {
        const value = duration - (Date.now() - adjustedStartedAt) / 1000 - 0.5

        if (value <= 0) {
          setValue(0)
        } else {
          setValue(value)
          handle = requestAnimationFrame(tick)
        }
      }

      tick()
    } else {
      setValue(null)
    }

    return () => {
      if (handle) cancelAnimationFrame(handle)
    }
  }, [duration, startedAt])

  return value
}
