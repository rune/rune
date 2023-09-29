export function getDimensions<Dimensions extends number | number[]>(
  value: Dimensions
): number {
  return Array.isArray(value) ? value.length : -1
}

export function lerp(a: number, b: number, t: number) {
  return (b - a) * t + a
}
