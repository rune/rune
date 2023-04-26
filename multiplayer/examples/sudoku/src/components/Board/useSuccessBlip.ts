import { Coordinate } from "../../lib/types/GameState"
import { useAtomValue } from "jotai/index"
import { $successes } from "../../state/$game"
import { useRef, useState, useEffect } from "react"

const blipDelay = 400
export const blipDuration = 200
export const totalBlipsDuration =
  blipDelay + 9 * (blipDuration / 2) + blipDuration

export function useSuccessBlip({ row, col }: Coordinate) {
  const successes = useAtomValue($successes)
  const processedSuccessesLength = useRef(successes.length)
  const [successBlip, setSuccessBlip] = useState(false)

  useEffect(() => {
    if (successes.length > processedSuccessesLength.current) {
      const handles: ReturnType<typeof setTimeout>[] = []

      for (const success of successes.slice(processedSuccessesLength.current)) {
        if ("row" in success && success.row === row) {
          handles.push(
            setTimeout(() => {
              setSuccessBlip(true)
              handles.push(
                setTimeout(() => setSuccessBlip(false), blipDuration)
              )
            }, blipDelay + col * (blipDuration / 2))
          )
        } else if ("col" in success && success.col === col) {
          handles.push(
            setTimeout(() => {
              setSuccessBlip(true)
              handles.push(
                setTimeout(() => setSuccessBlip(false), blipDuration)
              )
            }, blipDelay + row * (blipDuration / 2))
          )
        } else if (
          "section" in success &&
          success.section === Math.floor(row / 3) * 3 + Math.floor(col / 3)
        ) {
          handles.push(
            setTimeout(() => {
              setSuccessBlip(true)
              handles.push(
                setTimeout(() => setSuccessBlip(false), blipDuration)
              )
            }, blipDelay + ((row % 3) * 3 + (col % 3)) * (blipDuration / 2))
          )
        }
      }

      processedSuccessesLength.current = successes.length

      return () => handles.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successes.length])

  return { successBlip }
}
