export interface Panorama {
  name: string
  latitude: number
  longitude: number
  view: {
    hLookAt: number
    vLookAt: number
    fov: number
    minFov: number
    maxFov: number
  }
  levels: {
    level: number
    size: number
    tiles: number
  }[]
  authorName: string
}
