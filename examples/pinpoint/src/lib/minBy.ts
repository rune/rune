export function minBy<T>(list: T[], selector: (item: T) => any) {
  let minItem = list[0]
  let minValue = selector(minItem)

  for (let i = 1; i < list.length; i++) {
    const item = list[i]
    const value = selector(item)

    if (value < minValue) {
      minItem = item
      minValue = value
    }
  }

  return minItem
}
