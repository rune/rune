// From: https://stackoverflow.com/a/21623206
import { Coordinate } from "ol/coordinate"

export function calculateDistanceKm(from: Coordinate, to: Coordinate) {
  const [lon1, lat1] = from
  const [lon2, lat2] = to

  const p = 0.017453292519943295
  const c = Math.cos
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

  return 12742 * Math.asin(Math.sqrt(a))
}
