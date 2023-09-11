import * as allPanoramas from "../src/lib/data/panoramas.json"
import * as assert from "assert"

function verifyPanoramas() {
  for (const item of allPanoramas) {
    // fov
    assert(
      typeof item.view.fov === "number" &&
        typeof item.view.minFov === "number" &&
        typeof item.view.maxFov === "number"
    )

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
