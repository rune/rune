import "@photo-sphere-viewer/core/index.scss"

import { useEffect, useMemo, useRef, useState } from "react"
import { Viewer } from "@photo-sphere-viewer/core"
import {
  CubemapTilesAdapter,
  CubemapMultiTilesPanorama,
} from "@photo-sphere-viewer/cubemap-tiles-adapter"
import { CubemapPanorama } from "@photo-sphere-viewer/cubemap-adapter"
import { Panorama } from "./types"
import { remap } from "../lib/remap"

const zoomRanges = [
  [180, 50],
  [50, 35],
  [35, 15],
  [15, 0],
]

function mapFovToZoom(
  fov: number,
  { minFov, maxFov }: { minFov: number; maxFov: number }
) {
  const zoom = remap(fov, [minFov, maxFov], [100, 0])
  return zoom > 100 ? 100 : zoom < 0 ? 0 : zoom
}

export function PanoramaViewer({ name, view, levels }: Panorama) {
  // eslint-disable-next-line no-restricted-globals
  const baseUrl = `https://games-staging.rune.ai/panoramas-test/${name}`
  const containerRef = useRef<HTMLDivElement | null>(null)

  const panorama = useMemo<
    Omit<CubemapMultiTilesPanorama, "baseUrl"> & {
      baseUrl: CubemapPanorama
    }
  >(
    () => ({
      baseUrl: {
        left: `${baseUrl}/small/left.jpg`,
        right: `${baseUrl}/small/right.jpg`,
        front: `${baseUrl}/small/front.jpg`,
        back: `${baseUrl}/small/back.jpg`,
        top: `${baseUrl}/small/up.jpg`,
        bottom: `${baseUrl}/small/down.jpg`,
      },
      levels: levels.map((level, i) => {
        const zoomRange = [
          zoomRanges[i][0],
          i === levels.length - 1 ? 0 : zoomRanges[i][1],
        ]

        return {
          faceSize: level.size,
          nbTiles: level.tiles,
          range: zoomRange,
          zoomRange: [
            mapFovToZoom(zoomRange[0], view),
            mapFovToZoom(zoomRange[1], view),
          ],
        }
      }),
      tileUrl: (face, col, row, level) =>
        `${baseUrl}/tiles/${level + 2}/${
          face === "top" ? "up" : face === "bottom" ? "down" : face
        }-${col}-${row}.jpg`,
    }),
    [baseUrl, levels, view]
  )

  const [viewer, setViewer] = useState<Viewer | undefined>()

  useEffect(() => {
    if (!containerRef.current) return

    setViewer(
      new Viewer({
        container: containerRef.current,
        adapter: [CubemapTilesAdapter, { flipTopBottom: true }],
        navbar: false,
      })
    )
  }, [])

  useEffect(() => () => viewer?.destroy(), [viewer])

  useEffect(() => {
    if (!viewer) return

    viewer.setOptions({ minFov: view.minFov, maxFov: view.maxFov })
    viewer.setPanorama(panorama, {
      transition: false,
      yaw: ((2 * Math.PI) / 360) * view.hLookAt,
      pitch: (-Math.PI / 2 / 90) * view.vLookAt,
      zoom: mapFovToZoom(90, view),
    })
  }, [panorama, view, viewer])

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}
