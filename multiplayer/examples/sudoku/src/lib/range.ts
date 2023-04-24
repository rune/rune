export function range(end: number): number[]
export function range(start: number, end: number): number[]
export function range(start: number, end?: number): number[] {
  if (end === undefined) return range(0, start)
  return [...Array(Math.abs(end - start)).keys()].map(
    (i) => start + i * Math.sign(end - start)
  )
}
