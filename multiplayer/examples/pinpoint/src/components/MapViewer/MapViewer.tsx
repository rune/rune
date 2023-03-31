import React, { useState, useEffect, useMemo, useCallback } from "react"
import { OLMap, Pin } from "./OLMap"
import { generateAvatarUrl } from "../../lib/avatar"
import { getRandomArbitrary } from "../../lib/getRandomArbitrary"
import { Coordinate } from "ol/coordinate"
import { calculateDistanceKm } from "../../lib/calculateDistanceKm"
import { pickBestGuessRepresentation } from "../../lib/pickBestGuessRepresentation"

export function MapViewer() {
  const center = useMemo(() => [-74.01, 40.71], [])
  const [target, setTarget] = useState<Coordinate | null>(null)
  const [guesses, setGuesses] = useState<[string, Coordinate][]>([])

  const pins = useMemo<Pin[]>(() => {
    if (!target) return []

    return [
      { type: "flag" as const, location: target },
      ...guesses.map(([avatarUrl, location]) => ({
        type: "guess" as const,
        avatarUrl: avatarUrl,
        location: pickBestGuessRepresentation(target, location),
        distanceText: `${Math.round(calculateDistanceKm(target, location))}km`,
      })),
    ]
  }, [guesses, target])

  useEffect(() => {
    const area = [-70, 40]
    const spread = 10

    function randomCoord() {
      return [
        getRandomArbitrary(area[0] - spread, area[0] + spread),
        getRandomArbitrary(area[1] - spread, area[1] + spread),
      ]
    }

    setTarget(randomCoord())

    setGuesses([
      [generateAvatarUrl(), randomCoord()],
      [generateAvatarUrl(), randomCoord()],
      [generateAvatarUrl(), randomCoord()],
    ])
  }, [])

  const onClick = useCallback((coords: Coordinate) => {
    console.log(coords)
    setTarget(coords)
  }, [])

  return <OLMap center={center} zoom={11.8} pins={pins} onClick={onClick} />
}
