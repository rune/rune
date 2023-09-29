import { getDimensions } from "./dimensions"

function isDefined(value: unknown) {
  return value !== undefined && value !== null
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

export function validateUpdateParams<Dimensions extends number | number[]>(
  params: { current: Dimensions; future: Dimensions },
  size: number | null
) {
  assert(
    isDefined(params) && isDefined(params.current) && isDefined(params.future),
    "current & future must be defined"
  )

  const currentSize = getDimensions(params.current)
  const futureSize = getDimensions(params.future)

  //In case update was already called, verify the dimensions didn't change
  if (size !== null) {
    assert(
      size === currentSize && size === futureSize,
      "current & future must remain same dimensions in all update calls"
    )
  }

  assert(currentSize !== 0, "current & future must not be an empty array")
  assert(currentSize === futureSize, "current and future dimensions must match")
  assert(
    currentSize < 5,
    "current & future must be either a number or array of numbers up to 4 dimensions"
  )

  if (currentSize > 0) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(params.current as number[]).forEach((currentPosition, index) => {
      const futurePosition = (params.future as number[])[index]

      assert(
        isDefined(currentPosition) && Number.isFinite(currentPosition),
        `current[${index}] must be a number`
      )
      assert(
        isDefined(futurePosition) && Number.isFinite(currentPosition),
        `future[${index}] must be a number`
      )
    })
  }
}
