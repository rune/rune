import { useState, useRef, useEffect, useMemo } from "react"
import { timings } from "../animation/config"
import { useAtomValue } from "jotai"
import { $game } from "../../state/game"
import { $myPlayerId } from "../../state/myPlayerId"

export function useLatestGuess() {
  const game = useAtomValue($game)!
  const round = game.currentRound
  const myPlayerId = useAtomValue($myPlayerId)
  const guesses = useMemo(
    () => game.guesses.filter((guess) => guess.round === round),
    [game.guesses, round]
  )
  const latestGuess = useMemo(
    () => guesses.filter((guess) => guess.playerId !== myPlayerId).at(-1),
    [guesses, myPlayerId]
  )
  const [latestGuessShown, setLatestGuessShown] = useState(false)

  const latestGuessRef = useRef(latestGuess)
  useEffect(() => {
    if (latestGuessRef.current?.playerId === latestGuess?.playerId) return

    latestGuessRef.current = latestGuess

    if (latestGuess) setLatestGuessShown(true)
  }, [latestGuess])

  useEffect(() => {
    if (latestGuess && latestGuessShown) {
      const handle = setTimeout(
        () => setLatestGuessShown(false),
        timings.defaultDelay
      )
      return () => clearTimeout(handle)
    }
  }, [latestGuess, latestGuessShown])

  return {
    latestGuess,
    latestGuessShown,
  }
}
