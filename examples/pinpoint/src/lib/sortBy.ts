export function sortBy<T>(list: T[], ...selectors: ((item: T) => any)[]) {
  return list.slice().sort((a, b) => {
    for (const selector of selectors) {
      const aKey = selector(a)
      const bKey = selector(b)

      if (aKey < bKey) return -1
      if (aKey > bKey) return 1
    }

    return 0
  })
}
