export function rel(pixels: number) {
  return `${pixels > 0 ? "min" : "max"}(${
    Math.round((pixels / 375) * 1e4) / 1e2
  }vw, ${pixels * 1.5}px)`
}
