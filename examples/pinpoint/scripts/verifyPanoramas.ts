import * as allPanoramas from "../src/lib/data/panoramas.json"
import * as assert from "assert"

import { MathUtils as MathUtils6 } from "three"

// Copied from src/components/PanoramaView/PhotoSphereViewer.tsx
const zoomRanges = [
  [180, 50],
  [50, 35],
  [35, 15],
  [15, 0],
]
export function remap(
  value: number,
  [originalMin, originalMax]: [number, number],
  [newMin, newMax]: [number, number]
) {
  return (
    newMin +
    ((value - originalMin) * (newMax - newMin)) / (originalMax - originalMin)
  )
}
function mapFovToZoom(
  fov: number,
  { minFov, maxFov }: { minFov: number; maxFov: number }
) {
  const zoom = remap(fov, [minFov, maxFov], [100, 0])
  return zoom > 100 ? 100 : zoom < 0 ? 0 : zoom
}

function verifyPanoramas() {
  for (const item of allPanoramas) {
    // fov
    assert(
      typeof item.view.fov === "number" &&
        typeof item.view.minFov === "number" &&
        typeof item.view.maxFov === "number"
    )
    // https://photo-sphere-viewer.js.org/guide/config.html#standard-options
    assert(item.view.maxFov > item.view.minFov && item.view.maxFov < 180)
    assert(item.view.minFov > 1 && item.view.minFov < item.view.maxFov)

    assert(!Number.isNaN(MathUtils6.degToRad(item.view.fov)))
    assert(!Number.isNaN(MathUtils6.degToRad(item.view.maxFov)))
    assert(!Number.isNaN(MathUtils6.degToRad(item.view.minFov)))

    // src/components/PanoramaView/PhotoSphereViewer.tsx
    assert(item.levels.length > 0 && item.levels.length <= 3)
    item.levels.forEach((level, i) => {
      const zoomRange = [
        zoomRanges[i][0],
        i === item.levels.length - 1 ? 0 : zoomRanges[i][1],
      ]

      const z1 = mapFovToZoom(zoomRange[0], item.view)
      const z2 = mapFovToZoom(zoomRange[1], item.view)

      assert(z1 >= 0 && z1 <= 100)
      assert(z2 >= 0 && z2 <= 100)
    })

    // yaw & pitch
    assert(
      typeof item.view.hLookAt === "number" &&
        !Number.isNaN(((2 * Math.PI) / 360) * item.view.hLookAt)
    )
    assert(
      typeof item.view.vLookAt === "number" &&
        !Number.isNaN((-Math.PI / 2 / 90) * item.view.vLookAt)
    )

    // latitude & longitude
    assert(
      typeof item.latitude === "number" &&
        item.latitude > -90 &&
        item.latitude < 90
    )
    assert(
      typeof item.longitude === "number" &&
        item.longitude > -180 &&
        item.latitude < 180
    )

    // names
    assert(
      typeof item.name === "string" &&
        item.name.length > 2 &&
        item.name.length < 100
    )
    assert(
      typeof item.authorName === "string" &&
        item.authorName.length > 2 &&
        item.authorName.length < 100
    )
  }
}

// Run directly if called.
// This is used to allow other files to import these functions.
if (!module.parent) verifyPanoramas()
