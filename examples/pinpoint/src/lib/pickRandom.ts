export function pickRandom<T>(arr: T[], n: number) {
  const resArr: T[] = []
  for (const _ of Array.from(Array(n).keys())) {
    const randomItem = arr[Math.floor(Math.random() * arr.length)]
    resArr.push(randomItem)
  }

  return resArr
}
