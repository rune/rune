export function fadeRgbaColor(color: string, alpha: string) {
  return [...color.split(",").slice(0, -1), `${alpha})`].join(",")
}
