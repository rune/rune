export type Interpolator = <Dimensions extends number | number[]>() => {
  update: (params: { game: Dimensions; futureGame: Dimensions }) => void
  getPosition: () => Dimensions
}

export type InterpolatorLatency = <Dimensions extends number | number[]>() => {
  update: (params: { game: Dimensions; futureGame: Dimensions }) => void
  getPosition: () => Dimensions
  jump: (game: Dimensions) => void
}
