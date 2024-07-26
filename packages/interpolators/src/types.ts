export type InterpolatorFactory = <
  Dimensions extends number | number[],
>() => Interpolator<Dimensions>

export type Interpolator<Dimensions extends number | number[]> = {
  update: (params: { game: Dimensions; futureGame: Dimensions }) => void
  getPosition: () => Dimensions
}

export type InterpolatorLatencyFactory = <
  Dimensions extends number | number[],
>(config: {
  maxSpeed: number
  timeToMaxSpeed?: number
}) => InterpolatorLatency<Dimensions>

export type InterpolatorLatency<Dimensions extends number | number[]> = {
  update: (params: { game: Dimensions; futureGame: Dimensions }) => void
  getPosition: () => Dimensions
  jump: (game: Dimensions) => void
}
