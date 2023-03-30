import React, { useEffect, useRef } from "react"
import styled from "styled-components/macro"
import Map from "ol/Map"
import View from "ol/View"
import OSM from "ol/source/OSM"
import TileLayer from "ol/layer/Tile"
import { useGeographic, fromLonLat } from "ol/proj"
import { Point } from "ol/geom"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Feature, Overlay } from "ol"
import { Style, Icon, Text, Fill, Stroke } from "ol/style"
import LayerGroup from "ol/layer/Group"
import { createEmpty, extend, containsCoordinate } from "ol/extent"
import { generateAvatarUrl } from "../lib/avatar"
import { createPortal } from "react-dom"
import CircleStyle from "ol/style/Circle"

// eslint-disable-next-line react-hooks/rules-of-hooks
useGeographic()

export function TestMap() {
  const portal = useRef(document.createElement("div"))

  useEffect(() => {
    const map = new Map({
      controls: [],
      target: "map",
      // interactions: [],
      layers: [
        new TileLayer({
          source: new OSM({
            // wrapX: false,
            // wrapX: false,
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 11.8,
        // maxResolution: 10000,
        // smoothResolutionConstraint: false,
        // extent: [-180, -90, 180, 90],
      }),
    })

    function createMarker(color: string, position: Point) {
      const source = new VectorSource({
        features: [new Feature(position)],
      })

      return new VectorLayer({
        source: source,
        style: [
          new Style({
            image: new CircleStyle({
              radius: 25,
              fill: new Fill({ color: color }),
            }),
          }),
          new Style({
            image: new Icon({
              anchor: [0.5, 0.5],
              src: generateAvatarUrl(),
              scale: 0.1,
            }),
            text: new Text({
              text: Math.floor(Math.random() * 100).toString(),
              backgroundFill: new Fill({ color: "white" }),
              backgroundStroke: new Stroke({
                color: "grey",
                lineJoin: "round",
                lineCap: "round",
                width: 2,
              }),
              font: "13px sans-serif",
              offsetX: 40,
              padding: [5, 5, 5, 7],
            }),
          }),
        ],
      })
    }

    const markers = new LayerGroup({
      layers: [
        createMarker("red", new Point([-74.01, 40.71])),
        createMarker("green", new Point([-70.01, 42.71])),
        createMarker("blue", new Point([-74.13, 43.5])),
        createMarker("cyan", new Point([-74.33, 43.55])),
        // createMarker("yellow", new Point([-171, 66])),
        // createMarker("pink", new Point([172, 66])),
        // TODO: somehow solved by 172 - 360, but need an algorithm
        // TODO: probably just pick among 2 coords (+/-360) by whichever is closer to actual location
      ],
    })

    // map.addLayer(marker1)
    // map.addLayer(marker2)

    map.addLayer(markers)

    let extent = createEmpty()

    markers.getLayersArray().forEach((layer) => {
      // @ts-ignore
      const layerExtent = layer.getSource()?.getExtent()

      console.log({ layer: layer.getSource(), layerExtent })

      if (layerExtent) extend(extent, layerExtent)
    })

    map.getView().fit(extent, { size: map.getSize() })
    map.getView().setResolution((map.getView().getResolution() ?? 0) * 1.5)

    const overlay = new Overlay({
      element: portal.current,
      position: [-74.01, 40.71],
      positioning: "bottom-left",
      offset: [0, -20],
      autoPan: true,
    })

    map.addOverlay(overlay)

    map.on("click", (e) => {
      console.log(e.coordinate)
    })

    map.getView().on("change", (e) => {
      const curPos = overlay.getPosition()

      if (!(e.target instanceof View) || !curPos) return

      const extent = e.target.getViewStateAndExtent().extent

      const newPos = [...curPos]

      console.log("curPos", curPos, "extent", extent)

      if (curPos[0] < extent[0]) {
        newPos[0] += 360
      } else if (curPos[0] > extent[2]) {
        newPos[0] -= 360
      }

      if (containsCoordinate(extent, newPos)) overlay.setPosition(newPos)
    })

    console.log(fromLonLat([-74.01, 40.71]))

    return () => {
      map.dispose()
    }
  }, [])

  return (
    <Root>
      <MapContainer id="map"></MapContainer>
      {createPortal(
        <div
          id="text-bubble"
          style={{ background: "blue", color: "white", padding: 10 }}
        >
          TEXT BUBBLE
        </div>,
        portal.current
      )}
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  * {
    z-index: 0;
  }
`

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`
