import { Coordinate } from "../../lib/types/GameState"
import { useAtomValue } from "jotai"
import { $successes } from "../../state/$game"
import { useRef, useState, useEffect } from "react"
import { sounds } from "../../sounds/sounds"

const blipDelay = 400
export const blipDuration = 200
export const totalBlipsDuration =
  blipDelay + 9 * (blipDuration / 2) + blipDuration

export function useSuccessBlip({ row, col }: Coordinate) {
  const successes = useAtomValue($successes)
  const processedSuccessesLength = useRef(successes.length)
  const [successBlip, setSuccessBlip] = useState(false)

  const handlesRef = useRef<ReturnType<typeof setTimeout>[]>([])

  function timeout(callback: () => void, delay: number) {
    handlesRef.current.push(setTimeout(callback, delay))
  }

  useEffect(() => {
    if (successes.length > processedSuccessesLength.current) {
      if (row === 0 && col === 0) {
        timeout(() => sounds.success.play(), blipDelay)
      }

      for (const success of successes.slice(processedSuccessesLength.current)) {
        if ("row" in success && success.row === row) {
          timeout(
            () => {
              setSuccessBlip(true)
              timeout(() => setSuccessBlip(false), blipDuration)
            },
            blipDelay + col * (blipDuration / 2)
          )
        } else if ("col" in success && success.col === col) {
          timeout(
            () => {
              setSuccessBlip(true)
              timeout(() => setSuccessBlip(false), blipDuration)
            },
            blipDelay + row * (blipDuration / 2)
          )
        } else if (
          "section" in success &&
          success.section === Math.floor(row / 3) * 3 + Math.floor(col / 3)
        ) {
          timeout(
            () => {
              setSuccessBlip(true)
              timeout(() => setSuccessBlip(false), blipDuration)
            },
            blipDelay + ((row % 3) * 3 + (col % 3)) * (blipDuration / 2)
          )
        }
      }

      processedSuccessesLength.current = successes.length
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successes.length])

  useEffect(() => () => handlesRef.current.forEach(clearTimeout), [])

  return { successBlip }
}
