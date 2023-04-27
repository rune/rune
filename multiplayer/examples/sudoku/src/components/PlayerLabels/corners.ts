export const corners = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const

export const cornerCombinations = corners.flatMap((c1) =>
  corners.flatMap((c2) =>
    corners.flatMap((c3) => corners.flatMap((c4) => [[c1, c2, c3, c4]]))
  )
)
