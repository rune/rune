export function getRandomItem<T>(arr: T[]) {
  return arr.at(Math.floor(Math.random() * arr.length))
}
