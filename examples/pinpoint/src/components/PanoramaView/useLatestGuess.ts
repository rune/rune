import { useState, useRef, useEffect } from "react"
import { timings } from "../animation/config"
import { useAtomValue, atom } from "jotai"
import { $guesses } from "../../state/game"
import { $myPlayerId } from "../../state/myPlayerId"
import { sounds } from "../../sounds/sounds"

const $latestGuessByOtherPlayer = atom((get) => {
  const guesses = get($guesses)
  const myPlayerId = get($myPlayerId)

  return guesses.filter((guess) => guess.playerId !== myPlayerId).at(-1)
})

export function useLatestGuess() {
  const latestGuess = useAtomValue($latestGuessByOtherPlayer)

  const [latestGuessShown, setLatestGuessShown] = useState(false)

  const latestGuessRef = useRef(latestGuess)
  useEffect(() => {
    if (latestGuessRef.current?.playerId === latestGuess?.playerId) return

    latestGuessRef.current = latestGuess

    if (latestGuess) {
      setLatestGuessShown(true)
      sounds.otherPlayerGuess.play()
    }
  }, [latestGuess])

  useEffect(() => {
    if (latestGuess && latestGuessShown) {
      const handle = setTimeout(
        () => setLatestGuessShown(false),
        timings.delayLong
      )
      return () => clearTimeout(handle)
    }
  }, [latestGuess, latestGuessShown])

  return {
    latestGuess,
    latestGuessShown,
  }
}
