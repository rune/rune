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
  params: { game: Dimensions; futureGame: Dimensions },
  size: number | null
) {
  assert(
    isDefined(params) && isDefined(params.game) && isDefined(params.futureGame),
    "game & futureGame must be defined"
  )

  const gameSize = getDimensions(params.game)
  const futureGameSize = getDimensions(params.futureGame)

  //In case update was already called, verify the dimensions didn't change
  if (size !== null) {
    assert(
      size === gameSize && size === futureGameSize,
      "game & futureGame must remain same dimensions in all update calls"
    )
  }

  assert(gameSize !== 0, "game & futureGame must not be an empty array")
  assert(
    gameSize === futureGameSize,
    "game and futureGame dimensions must match"
  )
  assert(
    gameSize < 5,
    "game & futureGame must be either a number or array of numbers up to 4 dimensions"
  )

  if (gameSize > 0) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(params.game as number[]).forEach((gamePosition, index) => {
      const futureGamePosition = (params.futureGame as number[])[index]

      assert(
        isDefined(gamePosition) && Number.isFinite(gamePosition),
        `game[${index}] must be a number`
      )
      assert(
        isDefined(futureGamePosition) && Number.isFinite(gamePosition),
        `futureGame[${index}] must be a number`
      )
    })
  }
}
