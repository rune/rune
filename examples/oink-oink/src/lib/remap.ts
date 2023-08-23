export function remap(
  value: number,
  [originalMin, originalMax]: [number, number],
  [newMin, newMax]: [number, number]
) {
  return (
    newMin +
    ((value - originalMin) * (newMax - newMin)) / (originalMax - originalMin)
  )
}
