import "@photo-sphere-viewer/core/index.scss"

import { useEffect, useMemo, useRef, useLayoutEffect } from "react"
import { Viewer } from "@photo-sphere-viewer/core"
import {
  CubemapTilesAdapter,
  CubemapMultiTilesPanorama,
} from "@photo-sphere-viewer/cubemap-tiles-adapter"
import { Cubemap } from "@photo-sphere-viewer/cubemap-adapter"

import { remap } from "../../lib/remap"
import styled from "styled-components/macro"
import { Panorama } from "../../types/Panorama"

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

const portal = document.createElement("div")
portal.style.width = "100%"
portal.style.height = "100%"
document.getElementById("hidden")?.appendChild(portal)

const viewer = new Viewer({
  container: portal,
  adapter: [CubemapTilesAdapter, { flipTopBottom: true }],
  navbar: false,
  moveInertia: false,
})

export function PhotoSphereViewer({
  baseUrl,
  panorama: { name, view, levels },
  onFirstInteraction,
}: {
  baseUrl: string
  panorama: Panorama
  onFirstInteraction?: () => void
}) {
  // eslint-disable-next-line no-restricted-globals
  const panoramaUrl = `${baseUrl}/${name}`
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    containerRef.current?.appendChild(portal)

    return () => {
      document.getElementById("hidden")?.appendChild(portal)
    }
  }, [])

  const panorama = useMemo<
    Omit<CubemapMultiTilesPanorama, "baseUrl"> & { baseUrl: Cubemap }
  >(
    () => ({
      baseUrl: {
        left: `${panoramaUrl}/small/left.jpg`,
        right: `${panoramaUrl}/small/right.jpg`,
        front: `${panoramaUrl}/small/front.jpg`,
        back: `${panoramaUrl}/small/back.jpg`,
        top: `${panoramaUrl}/small/up.jpg`,
        bottom: `${panoramaUrl}/small/down.jpg`,
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
        `${panoramaUrl}/tiles/${level + 2}/${
          face === "top" ? "up" : face === "bottom" ? "down" : face
        }-${col}-${row}.jpg`,
    }),
    [panoramaUrl, levels, view]
  )

  const onFirstInteractionRef = useRef(onFirstInteraction)
  onFirstInteractionRef.current = onFirstInteraction

  useEffect(() => {
    if (!viewer) return

    if (viewer.config.panorama?.baseUrl.back === panorama.baseUrl.back) return

    viewer.setOptions({
      minFov: view.minFov,
      maxFov: view.maxFov,
    })

    function onInteraction() {
      onFirstInteractionRef.current?.()

      viewer.removeEventListener("position-updated", onInteraction)
      viewer.removeEventListener("zoom-updated", onInteraction)
    }

    viewer
      .setPanorama(panorama, {
        transition: true,
        showLoader: false,
        yaw: ((2 * Math.PI) / 360) * view.hLookAt,
        pitch: (-Math.PI / 2 / 90) * view.vLookAt,
        zoom: mapFovToZoom(90, view),
      })
      .then(() => {
        viewer.addEventListener("position-updated", onInteraction)
        viewer.addEventListener("zoom-updated", onInteraction)
      })

    function onZoomUpdated(e: { zoomLevel: number }) {
      // adjust zoom speed to approximate linear zoom behavior
      viewer.setOptions({
        zoomSpeed: remap(
          viewer.dataHelper.zoomLevelToFov(e.zoomLevel),
          [0, 180],
          [0.15, 1]
        ),
      })
    }

    viewer.addEventListener("zoom-updated", onZoomUpdated)

    return () => {
      viewer.removeEventListener("position-updated", onInteraction)
      viewer.removeEventListener("zoom-updated", onInteraction)
      viewer.removeEventListener("zoom-updated", onZoomUpdated as any)
    }
  }, [panorama, view])

  return <Root ref={containerRef} />
}

const Root = styled.div`
  width: 100%;
  height: 100%;
`
