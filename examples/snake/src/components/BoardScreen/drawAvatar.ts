import { Point } from "../../logic/types.ts"
import { shadowBlur, avatarBorder, avatarRadius } from "./drawConfig.ts"

const images = new Map<string, HTMLImageElement>()

export function drawAvatar(
  ctx: CanvasRenderingContext2D,
  scale: number,
  url: string,
  point: Point,
  color: string,
) {
  ctx.beginPath()
  ctx.arc(
    point.x * scale,
    point.y * scale,
    (avatarRadius + avatarBorder) * window.devicePixelRatio,
    0,
    2 * Math.PI,
  )

  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = shadowBlur * window.devicePixelRatio

  ctx.fill()
  ctx.fill()

  let image = images.get(url)

  if (!image) {
    image = new Image()
    image.src = url
    images.set(url, image)
  }

  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    point.x * scale - avatarRadius * window.devicePixelRatio,
    point.y * scale - avatarRadius * window.devicePixelRatio,
    avatarRadius * 2 * window.devicePixelRatio,
    avatarRadius * 2 * window.devicePixelRatio,
  )
}
