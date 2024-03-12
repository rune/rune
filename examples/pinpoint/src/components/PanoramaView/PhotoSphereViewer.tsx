import "@photo-sphere-viewer/core/index.scss"

import { useEffect, useMemo, useRef, useLayoutEffect, useState } from "react"
import { Viewer, ClickData } from "@photo-sphere-viewer/core"
import {
  CubemapTilesAdapter,
  CubemapMultiTilesPanorama,
} from "@photo-sphere-viewer/cubemap-tiles-adapter"
import { Cubemap } from "@photo-sphere-viewer/cubemap-adapter"

import { remap } from "../../lib/remap"
import styled from "styled-components/macro"
import { Panorama } from "../../lib/types/Panorama"
import { timings } from "../animation/config"

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
document.getElementById("hiddenPsv")?.appendChild(portal)

portal.style.transition = `opacity ${timings.default}ms`
portal.style.opacity = "0"
let firstPanoramaLoad = true

const viewer = new Viewer({
  container: portal,
  adapter: [CubemapTilesAdapter, { flipTopBottom: true }],
  navbar: false,
  loadingTxt: "",
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
  const panoramaUrl = `${baseUrl}/${name}`
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    containerRef.current?.appendChild(portal)

    return () => {
      document.getElementById("hiddenPsv")?.appendChild(portal)
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

  // This hacky logic prevents changing the panorama while some of the current
  // panorama's tiles are still loading. This is necessary because the library
  // doesn't provide a way to cancel loading tiles and this sometimes causes a
  // race condition when the old tile finishes loading after the new panorama is
  // in place and this one tile would be out of place in the new set
  const [loadingQueueEmpty, setLoadingQueueEmpty] = useState(true)

  useEffect(() => {
    if (loadingQueueEmpty) return

    const timeout = setInterval(() => {
      if (
        Object.keys((viewer as any).adapter.queue.runningTasks).length === 0
      ) {
        setLoadingQueueEmpty(true)
      }
    }, 250)

    return () => clearInterval(timeout)
  }, [loadingQueueEmpty])

  useEffect(() => {
    if (!viewer) return

    if (viewer.config.panorama?.baseUrl.back === panorama.baseUrl.back) return

    if (!loadingQueueEmpty) return

    if (Object.keys((viewer as any).adapter.queue.runningTasks).length) {
      setLoadingQueueEmpty(false)
      return
    }

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
        // showLoader:false prevents the loader from showing when one panorama
        // switches to another, but it doesn't work for the first panorama for
        // some reason
        if (firstPanoramaLoad) {
          portal.style.opacity = "1"
          firstPanoramaLoad = false
        }
        viewer.addEventListener("position-updated", onInteraction)
        viewer.addEventListener("zoom-updated", onInteraction)
      })

    let inertiaTimeoutHandle: ReturnType<typeof setTimeout>

    function onZoomUpdated(e: { zoomLevel: number }) {
      // adjust zoom speed to approximate linear zoom behavior
      viewer.setOptions({
        zoomSpeed: remap(
          viewer.dataHelper.zoomLevelToFov(e.zoomLevel),
          [0, 180],
          [0.15, 1]
        ),
      })

      viewer.setOptions({ moveInertia: false })

      if (e.zoomLevel === 0) viewer.zoom(0.01)
      else if (e.zoomLevel === 100) viewer.zoom(99.99)

      clearTimeout(inertiaTimeoutHandle)

      inertiaTimeoutHandle = setTimeout(
        () => viewer.setOptions({ moveInertia: true }),
        200
      )
    }

    viewer.addEventListener("zoom-updated", onZoomUpdated)

    function onDoubleClick(e: { data: ClickData }) {
      const position = viewer.dataHelper.viewerCoordsToSphericalCoords({
        x: e.data.viewerX,
        y: e.data.viewerY,
      })

      const zoom = viewer.dataHelper.fovToZoomLevel(
        viewer.dataHelper.zoomLevelToFov(viewer.getZoomLevel()) - 20
      )

      viewer.stopAnimation().then(() =>
        viewer.animate({
          zoom,
          ...position,
          speed: timings.default,
        })
      )
    }

    viewer.addEventListener("dblclick", onDoubleClick)

    return () => {
      clearTimeout(inertiaTimeoutHandle)
      viewer.removeEventListener("position-updated", onInteraction)
      viewer.removeEventListener("zoom-updated", onInteraction)
      viewer.removeEventListener("zoom-updated", onZoomUpdated as any)
      viewer.removeEventListener("dblclick", onDoubleClick as any)
    }
  }, [loadingQueueEmpty, panorama, view])

  return <Root ref={containerRef} />
}

const Root = styled.div`
  width: 100%;
  height: 100%;
`
