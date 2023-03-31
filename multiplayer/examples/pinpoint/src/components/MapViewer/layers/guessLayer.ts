import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import { Style, Fill, Icon, Text } from "ol/style"
import CircleStyle from "ol/style/Circle"
import pinIcon from "../img/pin.svg"

export const avatarSize = 35
const avatarBorder = 5
const pinSize = 13
const textStyle = "700 13px sans-serif"
const textPadding = 15

export function guessLayer(
  source: VectorSource,
  avatarUrl: string,
  distanceText: string
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
      distanceTextStyle(distanceText),
    ],
  })
}

function distanceTextStyle(text: string) {
  const offset = avatarSize / 2 + 5
  const width = (calculateTextWidth(text, textStyle) ?? 0) + textPadding

  const svg = `
    <svg width="${width}" height="23" viewBox="0 0 ${width} 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="${
        width - 1
      }" height="22" rx="11" fill="#D8F1E8"/>
      <rect x="0.5" y="0.5" width="${
        width - 1
      }" height="22" rx="11" stroke="#A7E4D5"/>
    </svg>
  `

  const img = new Image()
  img.src = "data:image/svg+xml," + escape(svg)

  return new Style({
    image: new Icon({
      img,
      imgSize: [width, 23],
      anchor: [-offset, 0.5],
      anchorXUnits: "pixels",
      offset: [0, 0],
      displacement: [0, avatarSize / 2 + (pinSize / 3) * 2],
    }),
    text: new Text({
      text,
      font: textStyle,
      fill: new Fill({ color: "#01A491" }),
      offsetX: offset + width / 2,
      offsetY: -(avatarSize / 2 + (pinSize / 3) * 2) - 1,
    }),
  })
}

function calculateTextWidth(text: string, font: string) {
  const ctx = document.createElement("canvas").getContext("2d")

  if (ctx) {
    ctx.font = font
    return ctx.measureText(text).width
  }
}
