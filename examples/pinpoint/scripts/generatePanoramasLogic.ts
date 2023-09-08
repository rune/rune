import * as allPanoramas from "../src/lib/data/panoramas.json"
import * as fs from "fs"

type Panorama = { longitude: number; latitude: number }
type BucketId = number
type CellId = `${BucketId}-${BucketId}`

const NUMBER_OF_LONGITUDE_BUCKETS = 30
const NUMBER_OF_LATITUDE_BUCKETS = 30

// Returns number from 0 to numberOfCells - 1
const getBucketId = (
  value: number,
  options: { min: number; max: number; numberOfCells: number }
) => {
  const { min, max, numberOfCells } = options

  if (value === max) return 0 // max is the same as min

  const normalizedValue = (value - min) / (max - min) // [0, 1]

  return Math.floor(normalizedValue * numberOfCells)
}

// Returns integer from 1 to max
const getWeight = (value: number, max: number) => {
  const weight = 1 / value // (0, 1]
  const normalizedWeight = weight * max // [1, max]
  const roundedWeight = Math.round(normalizedWeight)

  return roundedWeight
}

const addWeights = (panoramas: Panorama[]) => {
  // Group by cellId
  const groupedPanoramas: Record<CellId, Panorama[]> = {}
  let maxNumberOfPanoramasInCell = -1
  panoramas.forEach((panorama) => {
    const { longitude, latitude } = panorama

    const longitudeBucketId = getBucketId(longitude, {
      min: -180,
      max: 180,
      numberOfCells: NUMBER_OF_LONGITUDE_BUCKETS,
    })
    const latitudeBucketId = getBucketId(latitude, {
      min: -90,
      max: 90,
      numberOfCells: NUMBER_OF_LATITUDE_BUCKETS,
    })

    const cellId = `${longitudeBucketId}-${latitudeBucketId}`

    if (!groupedPanoramas[cellId]) {
      groupedPanoramas[cellId] = []
    }
    groupedPanoramas[cellId].push(panorama)

    maxNumberOfPanoramasInCell = Math.max(
      maxNumberOfPanoramasInCell,
      groupedPanoramas[cellId].length
    )
  })

  // Add weight
  return Object.values(groupedPanoramas).flatMap((panoramas) => {
    return panoramas.map((panorama) => ({
      ...panorama,
      weight: getWeight(panoramas.length, maxNumberOfPanoramasInCell),
    }))
  })
}

function generatePanoramasLogic() {
  const panoramasWithWeight = addWeights(allPanoramas)

  const panoramasLogic = `export const panoramas: [number, number, number][] = JSON.parse('${JSON.stringify(
    panoramasWithWeight.map(({ longitude, latitude, weight }) => [
      longitude,
      latitude,
      weight,
    ])
  )}')`

  fs.writeFileSync("./src/lib/data/panoramasLogic.ts", panoramasLogic, "utf-8")
}

generatePanoramasLogic()
