export type Interpolator = <Dimensions extends number | number[]>() => {
  update: (params: { current: Dimensions; future: Dimensions }) => void
  getPosition: () => Dimensions
}
