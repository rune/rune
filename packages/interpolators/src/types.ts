export type Interpolator = <Dimensions extends number | number[]>() => {
  update: (params: { game: Dimensions; futureGame: Dimensions }) => void
  getPosition: () => Dimensions
}
