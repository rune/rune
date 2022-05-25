// A pseudorandom number generator (PRNG) for determinism.
// Based on the efficient mulberry32 with 32-bit state.
// From https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
export function randomNumberGenerator(seed: number) {
  // Initialize using hash function to avoid seed quality issues.
  // E.g. to avoid correlations between using 1 and 2 as seed.
  let hash = hashFromString(seed.toString())

  return function () {
    let t = (hash += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
// xmur3 from https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
// Returns a number as opposed to seed() function for ease of use.
export function hashFromString(str: string) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  const seed = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
  return seed()
}
