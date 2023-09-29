import { validateUpdateParams } from "../validation"
import { getDimensions, getPosition } from "../dimensions"

const runValidation = true

function moveTowardsSingleValue(from: number, to: number, maxSpeed: number) {
  const distance = to - from

  const distanceToMove = Math.min(Math.abs(distance), maxSpeed)

  return from + distanceToMove * Math.sign(distance)
}

function moveTowards<Dimensions extends number | number[]>(
  from: Dimensions,
  to: Dimensions,
  maxSpeed: number,
  size: number
): Dimensions {
  if (size > 0) {
    return (from as number[]).map((fromElement, index) =>
      moveTowardsSingleValue(fromElement, (to as number[])[index], maxSpeed)
    ) as Dimensions
  }

  return moveTowardsSingleValue(
    from as number,
    to as number,
    maxSpeed
  ) as Dimensions
}

export function interpolatorLatency<Dimensions extends number | number[]>({
  maxSpeed,
}: {
  maxSpeed: number
}) {
  let previousGame: Dimensions | undefined = undefined
  let game: Dimensions | undefined = undefined
  let futureGame: Dimensions | undefined = undefined

  let size: number | null = null

  return {
    update(params: { game: Dimensions; futureGame: Dimensions }) {
      // This value is set to true when `onChange` is called by `update` event.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!Rune._isOnChangeCalledByUpdate) {
        return
      }

      if (runValidation) {
        validateUpdateParams(params, size)
      }

      size = getDimensions(params.game)

      if (game === undefined) {
        previousGame = params.game
        game = params.game
        futureGame = params.futureGame
      } else {
        previousGame = game

        game = moveTowards(previousGame, params.game, maxSpeed, size)
        futureGame = moveTowards(game, params.futureGame, maxSpeed, size)
      }
    },

    getPosition(): Dimensions {
      return getPosition<Dimensions>(game, futureGame, size)
    },

    jump(jumpToGame: Dimensions) {
      previousGame = jumpToGame
      game = jumpToGame
      futureGame = jumpToGame
    },
  }
}
