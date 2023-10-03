export function getDimensions<Dimensions extends number | number[]>(
  value: Dimensions
): number {
  return Array.isArray(value) ? value.length : -1
}
