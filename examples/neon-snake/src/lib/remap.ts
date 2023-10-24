export function remap(x: number, from: [number, number], to: [number, number]) {
  return ((x - from[0]) * (to[1] - to[0])) / (from[1] - from[0]) + to[0]
}
