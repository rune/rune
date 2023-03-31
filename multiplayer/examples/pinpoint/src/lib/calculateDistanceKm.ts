import { Coordinate } from "ol/coordinate"

export function calculateDistanceKm(from: Coordinate, to: Coordinate) {
  const [lon1, lat1] = from
  const [lon2, lat2] = to

  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return 6371 * c
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}
