import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Feature } from "ol"
import { LineString } from "ol/geom"
import { Style, Stroke } from "ol/style"
import { Coordinate } from "ol/coordinate"

export function guessLineLayer(from: Coordinate, to: Coordinate) {
  return new VectorLayer({
    source: new VectorSource({
      features: [new Feature(new LineString([from, to]))],
    }),
    style: new Style({
      stroke: new Stroke({
        color: "grey",
        width: 3,
        lineDash: [10, 7],
      }),
    }),
  })
}
