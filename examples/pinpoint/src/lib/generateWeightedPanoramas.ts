type Longitude = number
type Latitude = number
type Weight = number // Must be integer
export type Panorama = [Longitude, Latitude, Weight]

export function generateWeightedPanoramas(panoramas: Panorama[]): Panorama[] {
  // Create array in which every panorama from panoramas array will appear as many times as weight of that panorama
  return panoramas.flatMap((panorama) => {
    const [, , weight] = panorama

    return Array(weight).fill(panorama)
  })
}
