export function rel(pixels: number) {
  return `${Math.round((pixels / 320) * 1e4) / 1e2}vw`
}
