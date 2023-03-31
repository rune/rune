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

// eslint-disable-next-line react-hooks/rules-of-hooks
useGeographic()

export type Pin =
  | { type: "flag"; location: Coordinate }
  | {
      type: "guess"
      location: Coordinate
      avatarUrl: string
      distanceText: string
    }

export function OLMap({
  center,
  zoom,
  pins,
  onClick,
}: {
  center: Coordinate
  zoom: number
  pins?: Pin[]
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
        view: new View({ center: [0, 0], zoom: 0 }),
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
  }, [center, map])

  useEffect(() => {
    map?.getView().setZoom(zoom)
  }, [map, zoom])

  useEffect(() => {
    const layerGroup = new LayerGroup()

    for (const pin of pins ?? []) {
      const source = new VectorSource({
        features: [new Feature(new Point(pin.location))],
      })

      if (pin.type === "flag") {
        layerGroup.getLayers().push(flagLayer(source))
      } else if (pin.type === "guess") {
        layerGroup
          .getLayers()
          .push(guessLayer(source, pin.avatarUrl, pin.distanceText))
      }
    }

    map?.getLayers().push(layerGroup)

    return () => {
      map?.getLayers().remove(layerGroup)
    }
  }, [map, pins])

  useEffect(() => {
    const pinsExtent = (pins ?? []).reduce(
      (extent, pin) => extend(extent, [...pin.location, ...pin.location]),
      createEmpty()
    )

    map
      ?.getView()
      .fit(pinsExtent, { size: map?.getSize(), padding: [100, 100, 100, 100] })
  }, [map, pins])

  return <Root ref={containerRef}></Root>
}

const Root = styled.div`
  width: 100%;
  height: 100%;
`
