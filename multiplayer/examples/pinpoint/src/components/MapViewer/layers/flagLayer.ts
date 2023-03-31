import { Style, Icon, Fill } from "ol/style"
import flagIcon from "../img/flag.svg"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import CircleStyle from "ol/style/Circle"

const flagWidth = 24
const flagHeight = flagWidth * (27 / 24)

export function flagLayer(source: VectorSource) {
  return new VectorLayer({
    source,
    style: [
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: flagIcon,
          width: flagWidth,
          height: flagHeight,
          displacement: [flagWidth * 0.35, flagHeight * 0.4],
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 1,
          fill: new Fill({ color: "blue" }),
        }),
      }),
    ],
  })
}
