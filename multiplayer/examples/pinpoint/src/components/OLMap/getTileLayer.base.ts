import TileLayer from "ol/layer/Tile"
import { OSM } from "ol/source"

export function getTileLayer() {
  return new TileLayer({
    source: new OSM(),
  })
}
