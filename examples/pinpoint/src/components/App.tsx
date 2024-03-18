import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"
import { PanoramaView } from "./PanoramaView/PanoramaView"
import { GuessingMapView } from "./MapView/GuessingMapView"
import { ScoreboardView } from "./ScoreboardView/ScoreboardView"
import { useAtom, useSetAtom, useAtomValue } from "jotai"
import { $game, $everyoneGuessed } from "../state/game"
import { $players } from "../state/players"
import { $myPlayerId } from "../state/myPlayerId"
import { useFlags } from "../state/flags"
import { $pendingGuess, $guessingMapView } from "../state/guessingMap"
import { Timer } from "./Timer"

export function App() {
  const [game, setGame] = useAtom($game)
  const [players, setPlayers] = useAtom($players)
  const setMyPlayerId = useSetAtom($myPlayerId)
  const { unsetFlag } = useFlags()
  const setPendingGuess = useSetAtom($pendingGuess)
  const setGuessingMapView = useSetAtom($guessingMapView)
  const everyoneGuessed = useAtomValue($everyoneGuessed)

  useEffect(() => {
    import("../logic").then(() =>
      Rune.initClient({
        onChange: ({ game, players, yourPlayerId }) => {
          setGame(game)
          setPlayers(players)
          setMyPlayerId(yourPlayerId)
        },
      })
    )
  }, [setGame, setMyPlayerId, setPlayers])

  const [view, setView] = useState<"panorama" | "map">("panorama")

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
      <Timer />
      {everyoneGuessed ? (
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
