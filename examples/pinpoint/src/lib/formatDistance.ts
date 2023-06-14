export function formatDistance(value: number) {
  return value > 1 ? `${Math.round(value)}km` : `${Math.round(value * 1000)}m`
}
