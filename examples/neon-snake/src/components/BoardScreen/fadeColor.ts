export function fadeColor(color: string, value: string) {
  return [...color.split(",").slice(0, -1), `${value})`].join(",")
}
