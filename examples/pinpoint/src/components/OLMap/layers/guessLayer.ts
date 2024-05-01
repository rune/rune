import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import { Style, Fill, Icon, Text } from "ol/style"
import CircleStyle from "ol/style/Circle"
import pinIcon from "../img/pin.svg"

export const avatarSize = 35
export const avatarBorder = 5
export const pinSize = 13

export function guessLayer(
  source: VectorSource,
  avatarUrl: string,
  confirmed: boolean
) {
  return new VectorLayer({
    source,
    style: [
      new Style({
        image: new CircleStyle({
          radius: avatarSize / 2,
          fill: new Fill({ color: "#01A491" }),
          displacement: [0, avatarSize / 2 + (pinSize / 3) * 2],
        }),
        ...(!confirmed && {
          text: new Text({
            text: "?",
            font: "600 27px Lexend",
            fill: new Fill({ color: "#D8F1E8" }),
            offsetY: -(avatarSize / 2 + (pinSize / 3) * 2) + 1,
          }),
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
      ...(confirmed
        ? [
            new Style({
              image: new Icon({
                anchor: [0.5, 0.5],
                src: avatarUrl,
                displacement: [0, avatarSize / 2 + (pinSize / 3) * 2],
                // size and scale are used instead of width/height to avoid android issue which sometimes ignores width/height for some reason
                size: [300, 300],
                scale: (avatarSize - avatarBorder) / 300,
              }),
            }),
          ]
        : []),
    ],
  })
}
