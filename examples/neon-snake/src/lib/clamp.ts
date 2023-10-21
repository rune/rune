export function clamp(x: number, range: [number, number]) {
  return Math.min(Math.max(x, range[0]), range[1])
}
