import React, { useCallback, useEffect } from "react"
import { PanoramaViewer } from "./PanoramaViewer"
import { Panorama } from "./types"
import { Rune } from "../lib/Rune"
import styled from "styled-components/macro"

export function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function App() {
  const [panorama, setPanorama] = React.useState<Panorama | null>(null)

  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame }) => {
        setPanorama(newGame.panorama)
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
        {!panorama ? (
          <button onClick={pickPanorama}>pick panorama</button>
        ) : (
          <button onClick={() => Rune.actions.setPanorama(null)}>clear</button>
        )}
      </Header>
      {!!panorama && <PanoramaViewer {...panorama} />}
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
