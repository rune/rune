function isDefined(value: unknown) {
  return value !== undefined && value !== null
}

export function validateUpdateParams<
  Dimensions extends number | number[]
>(params: { current: Dimensions; future: Dimensions }) {
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
