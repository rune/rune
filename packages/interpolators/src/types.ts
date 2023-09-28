export type Interpolator = <Dimensions extends number | number[]>() => {
  update: (params: { current: Dimensions; next: Dimensions }) => void
  getPosition: () => Dimensions
}
