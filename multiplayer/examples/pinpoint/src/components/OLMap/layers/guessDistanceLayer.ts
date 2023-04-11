import { Style, Icon, Text, Fill } from "ol/style"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import { avatarSize, pinSize } from "./guessLayer"

export function guessDistanceLayer(source: VectorSource, distanceText: string) {
  return new VectorLayer({
    source,
    style: [distanceTextStyle(distanceText)],
  })
}

export const textStyle = "700 13px Lexend"
export const textPadding = 15

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
      fill: new Fill({ color: "#01a491" }),
      offsetX: offset + width / 2,
      offsetY: -(avatarSize / 2 + (pinSize / 3) * 2),
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
