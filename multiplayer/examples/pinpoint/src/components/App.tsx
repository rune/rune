import React, { useEffect, useState, useMemo } from "react"
import styled from "styled-components/macro"
import { PanoramaView } from "./PanoramaView/PanoramaView"
import { GuessingMapView } from "./MapView/GuessingMapView"
import { ScoreboardView } from "./ScoreboardView/ScoreboardView"
import { useAtom, useSetAtom } from "jotai"
import { $game } from "../state/game"
import { $players } from "../state/players"
import { $myPlayerId } from "../state/myPlayerId"
import { useFlags } from "../state/flags"
import { $pendingGuess, $guessingMapView } from "../state/guessingMap"

export function App() {
  const [game, setGame] = useAtom($game)
  const [players, setPlayers] = useAtom($players)
  const setMyPlayerId = useSetAtom($myPlayerId)
  const { unsetFlag } = useFlags()
  const setPendingGuess = useSetAtom($pendingGuess)
  const setGuessingMapView = useSetAtom($guessingMapView)

  useEffect(() => {
    import("../logic").then(() =>
      Rune.initClient({
        onChange: ({ newGame, players, yourPlayerId }) => {
          setGame(newGame)
          setPlayers(players)
          setMyPlayerId(yourPlayerId)
        },
      })
    )
  }, [setGame, setMyPlayerId, setPlayers])

  const [view, setView] = useState<"panorama" | "map">("panorama")

  const roundFinished = useMemo(
    () =>
      game?.guesses.filter((guess) => guess.round === game?.currentRound)
        .length === game?.playerIds.length,
    [game?.currentRound, game?.guesses, game?.playerIds.length]
  )

  useEffect(() => {
    unsetFlag("startOfRoundShown")
    setView("panorama")
    setPendingGuess(null)
    setGuessingMapView({ center: [0, 0], zoom: 0 })
  }, [
    game?.sessionId,
    game?.currentRound,
    unsetFlag,
    setPendingGuess,
    setGuessingMapView,
  ])

  if (!game || !players) return <Root />

  return (
    <Root>
      {roundFinished ? (
        <ScoreboardView />
      ) : (
        <>
          {/* we're always keeping panorama rendered in the background to avoid a white flash */}
          <PanoramaView onOpenMapClick={() => setView("map")} />
          {view === "map" && (
            <GuessingMapView onBackClick={() => setView("panorama")} />
          )}
        </>
      )}
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;

  background: linear-gradient(
      0deg,
      rgba(1, 164, 145, 0.5),
      rgba(1, 164, 145, 0.5)
    ),
    rgba(216, 241, 232, 0.5);
`
