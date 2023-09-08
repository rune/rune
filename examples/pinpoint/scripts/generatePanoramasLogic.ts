import * as panoramas from "../src/lib/data/panoramas.json"
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

// Returns number from 0.0099 to 1
const getWeight = (value: number, min: number, max: number) => {
  const normalizedValue = (value - min) / (max - min) // [0, 1]
  const preparedValue = normalizedValue * 100 + 1 // [1, 101]
  const weight = 1 / preparedValue // [0.0099, 1]

  const roundedWeight = Number(weight.toFixed(4))

  return roundedWeight
}

const addWeights = (panoramas: Panorama[]) => {
  // Group by cellId
  const groupedPanoramas: Record<CellId, Panorama[]> = {}
  let minNumberOfPanoramasInCell = Number.MAX_SAFE_INTEGER
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

    minNumberOfPanoramasInCell = Math.min(
      minNumberOfPanoramasInCell,
      groupedPanoramas[cellId].length
    )
    maxNumberOfPanoramasInCell = Math.max(
      maxNumberOfPanoramasInCell,
      groupedPanoramas[cellId].length
    )
  })

  // Add weight
  return Object.values(groupedPanoramas).flatMap((panoramas) => {
    return panoramas.map((panorama) => ({
      ...panorama,
      weight: getWeight(
        panoramas.length,
        minNumberOfPanoramasInCell,
        maxNumberOfPanoramasInCell
      ),
    }))
  })
}

function generatePanoramasLogic() {
  const panoramasWithWeight = addWeights(panoramas)

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
