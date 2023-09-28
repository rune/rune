function lerp(a: number, b: number, t: number) {
  return (b - a) * t + a
}

function isDefined(value: unknown) {
  return value !== undefined && value !== null
}

const runValidation = true

export function interpolator<Dimensions extends number | number[]>() {
  let current: Dimensions | undefined = undefined
  let future: Dimensions | undefined = undefined

  return {
    update(params: { current: Dimensions; future: Dimensions }) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment

      //This value is set to true when `onChange` is called by `update` event.
      // @ts-ignore
      if (!Rune._isOnChangeCalledByUpdate) {
        return
      }

      if (runValidation) {
        if (!isDefined(params)) {
          throw new Error("current and future must be provided")
        }

        if (!isDefined(params.current)) {
          throw new Error("current must be number or array")
        }

        if (!isDefined(params.future)) {
          throw new Error("future must be number or array")
        }

        if (Array.isArray(params.current)) {
          if (!Array.isArray(params.future)) {
            throw new Error("current is array, future should be array too")
          }

          if (params.current.length !== params.future.length) {
            throw new Error("future length does not match current")
          }

          if (params.current.length === 0) {
            throw new Error("current & future must not be an empty array")
          }

          params.current.forEach((currentPosition, index) => {
            const futurePosition = (params.future as number[])[index]

            if (!isDefined(currentPosition)) {
              throw new Error(`current[${index}] must be a number`)
            }

            if (!isDefined(futurePosition)) {
              throw new Error(`future[${index}] must be a number`)
            }
          })
        } else {
          if (Array.isArray(params.future)) {
            throw new Error("current is number, future must be number too")
          }
        }
      }

      current = params.current
      future = params.future
    },

    getPosition(): Dimensions {
      if (current === undefined) {
        throw new Error(
          "getPosition can't be called before calling update at least once"
        )
      }

      const delta = Rune.timeSinceLastUpdate() / Rune.msPerUpdate

      if (Array.isArray(current) && Array.isArray(future)) {
        return current.map((curr, index) => {
          return lerp(curr, (future as number[])[index], delta)
        }) as Dimensions
      }

      return lerp(current as number, future as number, delta) as Dimensions
    },
  }
}
