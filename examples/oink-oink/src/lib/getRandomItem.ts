export function getRandomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}
