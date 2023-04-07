import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import { Style, Fill, Icon } from "ol/style"
import CircleStyle from "ol/style/Circle"
import pinIcon from "../img/pin.svg"

export const avatarSize = 35
export const avatarBorder = 5
export const pinSize = 13

export function guessLayer(source: VectorSource, avatarUrl: string) {
  return new VectorLayer({
    source,
    style: [
      new Style({
        image: new CircleStyle({
          radius: avatarSize / 2,
          fill: new Fill({ color: "#01A491" }),
          displacement: [0, avatarSize / 2 + (pinSize / 3) * 2],
        }),
      }),
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: pinIcon,
          width: pinSize,
          height: pinSize,
          displacement: [0, pinSize / 3],
        }),
      }),
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: avatarUrl,
          width: avatarSize - avatarBorder,
          height: avatarSize - avatarBorder,
          displacement: [0, avatarSize / 2 + (pinSize / 3) * 2],
        }),
      }),
    ],
  })
}
