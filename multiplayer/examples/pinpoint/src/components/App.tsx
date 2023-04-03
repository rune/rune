import React, { useCallback, useEffect, useState } from "react"
import { PanoramaViewer } from "./PanoramaViewer"
import { Panorama } from "./types"
import { Rune } from "../lib/Rune"
import styled from "styled-components/macro"
import { MapViewer } from "./MapViewer/MapViewer"

export function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function App() {
  const [view, setView] = useState<"panorama" | "map">("map")
  const [panorama, setPanorama] = useState<Panorama | null>(null)

  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame, players }) => {
        setPanorama(newGame.panorama)
        console.log(JSON.stringify([players, newGame], null, 2))
      },
    })
  }, [])

  const pickPanorama = useCallback(() => {
    // eslint-disable-next-line no-restricted-globals
    fetch(`https://games-staging.rune.ai/panoramas-test/index.json`)
      .then((r) => r.json())
      .then((panoramas: Panorama[]) =>
        Rune.actions.setPanorama(pickRandom(panoramas))
      )
  }, [])

  return (
    <Root>
      <Header>
        <select
          value={view}
          onChange={(e) => setView(e.target.value as typeof view)}
        >
          <option value="map">Map</option>
          <option value="panorama">Panorama</option>
        </select>

        {view === "panorama" &&
          (!panorama ? (
            <button onClick={pickPanorama}>pick panorama</button>
          ) : (
            <button onClick={() => Rune.actions.setPanorama(null)}>
              clear
            </button>
          ))}
      </Header>
      {view === "map" ? (
        <MapViewer />
      ) : view === "panorama" ? (
        !!panorama && <PanoramaViewer {...panorama} />
      ) : null}
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`
