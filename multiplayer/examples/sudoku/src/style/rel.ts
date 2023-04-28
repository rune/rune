const windowWidth = window.innerWidth
export function rel(pixels: number) {
  return `${Math.round((pixels / 320) * 1e4) / 1e2}vw`
}

export function relWhole(pixels: number) {
  return `${Math.round((pixels / 320) * windowWidth)}px`
}
