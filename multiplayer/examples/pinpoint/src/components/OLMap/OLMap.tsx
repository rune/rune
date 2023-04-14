import "ol/ol.css"
import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react"
import Map from "ol/Map"
import { useGeographic } from "ol/proj"
import styled, { createGlobalStyle, css } from "styled-components/macro"
import { Coordinate } from "ol/coordinate"
import LayerGroup from "ol/layer/Group"
import VectorSource from "ol/source/Vector"
import { Feature, MapBrowserEvent, View } from "ol"
import { Point } from "ol/geom"
import { createEmpty, extend } from "ol/extent"
import { flagLayer } from "./layers/flagLayer"
import { guessLayer } from "./layers/guessLayer"
import { guessLineLayer } from "./layers/guessLineLayer"
import { guessDistanceLayer } from "./layers/guessDistanceLayer"
import VectorLayer from "ol/layer/Vector"
import { animate } from "../../lib/animate"
import { timings } from "../animation/config"
import { Pixel } from "ol/pixel"
import { Attribution } from "ol/control"
import TileLayer from "ol/layer/Tile"
import { XYZ } from "ol/source"
import { DoubleClickZoom } from "ol/interaction"

// eslint-disable-next-line react-hooks/rules-of-hooks
useGeographic()

export type Pin =
  | {
      type: "flag"
      location: Coordinate
    }
  | {
      type: "guess"
      location: Coordinate
      confirmed: boolean
      targetLocation?: Coordinate
      avatarUrl: string
      distanceText?: string
    }

export interface MapRef {
  getPixelFromCoordinate: (coordinate: Coordinate) => Pixel | undefined
}

export const OLMap = forwardRef<
  MapRef,
  {
    center: Coordinate
    zoom: number
    pins?: Pin[]
    autoFitPins?: boolean
    onClick?: (coords: Coordinate) => void
    onInteraction?: () => void
  }
>(({ center, zoom, pins, autoFitPins, onClick, onInteraction }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)

  useImperativeHandle(
    ref,
    () => ({
      getPixelFromCoordinate: (coordinate: Coordinate) =>
        map?.getPixelFromCoordinate(coordinate),
    }),
    [map]
  )

  useEffect(() => {
    if (!containerRef.current) return

    const attribution = new Attribution({ collapsible: false })

    // const vectorTileLayer = new VectorTileLayer({
    //   declutter: true,
    //   className: "base",
    // })
    //
    // applyStyle(
    //   vectorTileLayer,
    //   "https://api.maptiler.com/maps/streets-v2/style.json?key=Bf09W8HTCpSRogf4976b"
    // )

    const tileLayer = new TileLayer({
      source: new XYZ({
        attributions: [
          '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
        ],
        url: "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}@2x.png?key=Bf09W8HTCpSRogf4976b",
        tilePixelRatio: 2,
      }),
    })

    const map = new Map({
      controls: [attribution],
      layers: [tileLayer],
      target: containerRef.current,
      view: new View({ center: [0, 0], zoom: 0, enableRotation: false }),
    })

    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof DoubleClickZoom) {
        map.removeInteraction(interaction)
      }
    })

    setMap(map)
  }, [])

  useEffect(() => {
    function handler(e: MapBrowserEvent<any>) {
      if (onClick) onClick(e.coordinate)
    }

    map?.on("click", handler)

    return () => map?.un("click", handler)
  }, [map, onClick])

  const onInteractionRef = useRef(onInteraction)
  onInteractionRef.current = onInteraction

  useEffect(() => {
    function handler() {
      onInteractionRef.current?.()
    }

    map?.getView().on("change", handler)

    return () => map?.getView().un("change", handler)
  }, [map])

  useEffect(() => () => map?.dispose(), [map])

  useEffect(() => {
    map?.getView().setCenter(center)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], map])

  useEffect(() => {
    map?.getView().setZoom(zoom)
  }, [map, zoom])

  useEffect(() => {
    if (!map) return

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
        layerGroup
          .getLayers()
          .push(guessLayer(source, pin.avatarUrl, pin.confirmed))

        if (pin.distanceText) {
          const distance = guessDistanceLayer(source, pin.distanceText)
          distances.push(distance)
          layerGroup.getLayers().push(distance)
        }
      }
    }

    map.getLayers().push(layerGroup)

    const disposeCallbacks: (() => void)[] = [
      () => map.getLayers().remove(layerGroup),
    ]

    if (lines.length > 0) {
      lines.forEach((line) => line.setOpacity(0))
      disposeCallbacks.push(
        animate(timings.mapLineDelay, timings.default, (opacity) => {
          lines.forEach((line) => line.setOpacity(opacity))
          map.render()
        })
      )
    }

    if (distances.length > 0) {
      distances.forEach((distance) => distance.setOpacity(0))
      disposeCallbacks.push(
        animate(timings.mapDistanceDelay, timings.default, (opacity) => {
          distances.forEach((distance) => distance.setOpacity(opacity))
          map.render()
        })
      )
    }

    return () => disposeCallbacks.forEach((cb) => cb())
  }, [map, pins])

  useEffect(() => {
    if (!pins?.length || !autoFitPins) return

    const pinsExtent = (pins ?? []).reduce(
      (extent, pin) => extend(extent, [...pin.location, ...pin.location]),
      createEmpty()
    )

    map
      ?.getView()
      .fit(pinsExtent, { size: map.getSize(), padding: [100, 100, 100, 100] })
  }, [autoFitPins, map, pins])

  return (
    <>
      <AttributionStyle />
      <Root ref={containerRef} />
    </>
  )
})

const Root = styled.div`
  width: 100%;
  height: 100%;
`

const AttributionStyle = createGlobalStyle`${css`
  .ol-attribution {
    background: rgba(255, 255, 255, 0.5) !important;
    ul {
      font-size: 8px;
    }
  }
`}`
