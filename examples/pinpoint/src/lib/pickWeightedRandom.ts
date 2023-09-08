type Longitude = number
type Latitude = number
type Weight = number // Must be integer
export type Arr = [Longitude, Latitude, Weight]

export function pickWeightedRandom(arr: Arr[]) {
  // Create weightedItems array in which every item from arr array will appear as many items as weight of that item
  const weightedItems = arr.flatMap((item) => {
    const [, , weight] = item

    return Array(weight).fill(item)
  })

  // Pick randomly from weightedItems
  // The chance of picking item with higher weight increases because it appears in weightedItems array more times
  return weightedItems[Math.floor(Math.random() * weightedItems.length)]
}
