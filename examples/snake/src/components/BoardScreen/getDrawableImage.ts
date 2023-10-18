const images = new Map<string, HTMLImageElement>()

export function getDrawableImage(src: string) {
  let image = images.get(src)

  if (!image) {
    image = new Image()
    image.src = src
    images.set(src, image)
  }

  return image
}
