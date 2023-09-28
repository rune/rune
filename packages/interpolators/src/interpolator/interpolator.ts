const lerp = (a: number, b: number, t: number) => (b - a) * t + a

export function interpolator<Dimensions extends number | number[]>() {
  let current: Dimensions | undefined = undefined
  let next: Dimensions | undefined = undefined

  return {
    update(params: { current: Dimensions; next: Dimensions }) {
      // @ts-ignore
      if (!Rune._isOnChangeCalledByUpdate) {
        return
      }

      if (params === undefined || params === null) {
        throw new Error("current and next must be provided")
      }

      if (params.current === null || params.current === undefined) {
        throw new Error("current must be number or array")
      }

      if (params.next === null || params.next === undefined) {
        throw new Error("next must be number or array")
      }

      if (Array.isArray(params.current)) {
        if (!Array.isArray(params.next)) {
          throw new Error("current is array, next should be array too")
        }

        if (params.current.length !== params.next.length) {
          throw new Error("next length does not match current")
        }

        if (params.current.length === 0) {
          throw new Error("current & next must not be an empty array")
        }

        params.current.forEach((el, index) => {
          const from = el
          const to = (params.next as number[])[index]

          if (from === null || from === undefined) {
            throw new Error(`current[${index}] must be a number`)
          }

          if (to === null || to === undefined) {
            throw new Error(`next[${index}] must be a number`)
          }
        })
      } else {
        if (Array.isArray(params.next)) {
          throw new Error("current is number, next must be number too")
        }
      }

      current = params.current
      next = params.next
    },

    getPosition(): Dimensions {
      if (current === undefined) {
        throw new Error(
          "getPosition can't be called before calling update at least once"
        )
      }

      const delta = Rune.timeSinceLastUpdate() / Rune.msPerUpdate

      if (Array.isArray(current) && Array.isArray(next)) {
        return current.map((curr, index) => {
          return lerp(curr, (next as number[])[index], delta)
        }) as Dimensions
      }

      return lerp(current as number, next as number, delta) as Dimensions
    },
  }
}
