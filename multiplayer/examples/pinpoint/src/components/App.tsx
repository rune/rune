import React, { useEffect, useState, useMemo } from "react"
import { Rune } from "../lib/Rune"
import styled from "styled-components/macro"
import { Players } from "rune-games-sdk/multiplayer"
import { PanoramaView } from "./PanoramaView/PanoramaView"
import { GameState } from "../types/GameState"
import { MyPlayerIdContext, PlayersContext, GameContext } from "../context"
import { GuessingMapView } from "./MapView/GuessingMapView"
import { ScoreboardView } from "./ScoreboardView/ScoreboardView"

export function App() {
  const [game, setGame] = useState<GameState>()
  const [players, setPlayers] = useState<Players>()
  const [myPlayerId, setMyPlayerId] = useState<string>()

  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame, players, yourPlayerId }) => {
        setGame(newGame as GameState)
        setPlayers(players)
        setMyPlayerId(yourPlayerId)
      },
    })
  }, [])

  const [view, setView] = useState<"panorama" | "map">("panorama")

  const roundFinished = useMemo(
    () =>
      game?.guesses.filter((guess) => guess.round === game?.currentRound)
        .length === game?.playerIds.length,
    [game?.currentRound, game?.guesses, game?.playerIds.length]
  )

  const currentRoundPanoramaName =
    game?.rounds[game?.currentRound]?.panorama.name

  useEffect(() => {
    setView("panorama")
  }, [currentRoundPanoramaName])

  if (!game || !players) return null

  return (
    <GameContext.Provider value={game}>
      <PlayersContext.Provider value={players}>
        <MyPlayerIdContext.Provider value={myPlayerId}>
          <Root>
            {roundFinished ? (
              <ScoreboardView />
            ) : view === "panorama" ? (
              <PanoramaView onOpenMapClick={() => setView("map")} />
            ) : view === "map" ? (
              <GuessingMapView onBackClick={() => setView("panorama")} />
            ) : null}
          </Root>
        </MyPlayerIdContext.Provider>
      </PlayersContext.Provider>
    </GameContext.Provider>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
`
