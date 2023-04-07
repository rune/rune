import { useRef, useEffect, useState } from "react"
import Map from "ol/Map"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { useGeographic } from "ol/proj"
import styled from "styled-components/macro"
import View from "ol/View"
import { Coordinate } from "ol/coordinate"
import LayerGroup from "ol/layer/Group"
import VectorSource from "ol/source/Vector"
import { Feature, MapBrowserEvent } from "ol"
import { Point } from "ol/geom"
import { createEmpty, extend } from "ol/extent"
import { flagLayer } from "./layers/flagLayer"
import { guessLayer } from "./layers/guessLayer"
import { guessLineLayer } from "./layers/guessLineLayer"
import { guessDistanceLayer } from "./layers/guessDistanceLayer"
import VectorLayer from "ol/layer/Vector"
import { animate } from "../../lib/animate"
import { timings } from "../animation/config"

// eslint-disable-next-line react-hooks/rules-of-hooks
useGeographic()

export type Pin =
  | { type: "flag"; location: Coordinate }
  | {
      type: "guess"
      location: Coordinate
      targetLocation?: Coordinate
      avatarUrl: string
      distanceText?: string
    }

export function OLMap({
  center,
  zoom,
  pins,
  autoFitPins,
  onClick,
}: {
  center: Coordinate
  zoom: number
  pins?: Pin[]
  autoFitPins?: boolean
  onClick?: (coords: Coordinate) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    setMap(
      new Map({
        controls: [],
        target: containerRef.current,
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({ center: [0, 0], zoom: 0, enableRotation: false }),
      })
    )
  }, [])

  useEffect(() => {
    function handler(e: MapBrowserEvent<any>) {
      if (onClick) onClick(e.coordinate)
    }

    map?.on("click", handler)

    return () => map?.un("click", handler)
  }, [map, onClick])

  useEffect(() => () => map?.dispose(), [map])

  useEffect(() => {
    map?.getView().setCenter(center)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], map])

  useEffect(() => {
    map?.getView().setZoom(zoom)
  }, [map, zoom])

  useEffect(() => {
    const lines: VectorLayer<VectorSource>[] = []
    const distances: VectorLayer<VectorSource>[] = []

    const layerGroup = new LayerGroup()

    for (const pin of pins ?? []) {
      if (pin.type === "guess" && pin.targetLocation) {
        const line = guessLineLayer(pin.location, pin.targetLocation)
        lines.push(line)
        layerGroup.getLayers().push(line)
      }
    }

    for (const pin of pins ?? []) {
      const source = new VectorSource({
        features: [new Feature(new Point(pin.location))],
      })

      if (pin.type === "flag") {
        layerGroup.getLayers().push(flagLayer(source))
      } else if (pin.type === "guess") {
        layerGroup.getLayers().push(guessLayer(source, pin.avatarUrl))

        if (pin.distanceText) {
          const distance = guessDistanceLayer(source, pin.distanceText)
          distances.push(distance)
          layerGroup.getLayers().push(distance)
        }
      }
    }

    map?.getLayers().push(layerGroup)

    lines.forEach((line) => line.setOpacity(0))
    const dispose1 = animate(
      timings.mapLineDelay,
      timings.default,
      (opacity) => {
        lines.forEach((line) => line.setOpacity(opacity))
        map?.render()
      }
    )

    distances.forEach((distance) => distance.setOpacity(0))
    const dispose2 = animate(
      timings.mapDistanceDelay,
      timings.default,
      (opacity) => {
        distances.forEach((distance) => distance.setOpacity(opacity))
        map?.render()
      }
    )

    return () => {
      map?.getLayers().remove(layerGroup)
      dispose1()
      dispose2()
    }
  }, [map, pins])

  useEffect(() => {
    if (!pins?.length || !autoFitPins) return

    const pinsExtent = (pins ?? []).reduce(
      (extent, pin) => extend(extent, [...pin.location, ...pin.location]),
      createEmpty()
    )

    map
      ?.getView()
      .fit(pinsExtent, { size: map?.getSize(), padding: [100, 100, 100, 100] })
  }, [autoFitPins, map, pins])

  return <Root ref={containerRef}></Root>
}

const Root = styled.div`
  width: 100%;
  height: 100%;
`
