import { validateUpdateParams } from "./validation"
import { getDimensions, lerp } from "./dimensions"

const runValidation = true

function moveTowardsSingleValue(from: number, to: number, maxSpeed: number) {
  const distance = Math.abs(to - from)

  const distanceToMove = distance < maxSpeed ? distance : maxSpeed

  return from + distanceToMove * (to > from ? 1 : -1)
}

function moveTowards<Dimensions extends number | number[]>(
  from: Dimensions,
  to: Dimensions,
  maxSpeed: number
): Dimensions {
  if (Array.isArray(from)) {
    return from.map((fromElement, index) =>
      moveTowardsSingleValue(fromElement, to[index], maxSpeed)
    ) as Dimensions
  }

  return moveTowardsSingleValue(from, to as number, maxSpeed) as Dimensions
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
      //This value is set to true when `onChange` is called by `update` event.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!Rune._isOnChangeCalledByUpdate) {
        return
      }

      if (runValidation) {
        validateUpdateParams(params, size)
      }

      size = getDimensions(params.game)

      if (!game) {
        previousGame = params.game
        game = params.game
        futureGame = params.futureGame
      } else {
        previousGame = game

        game = moveTowards(previousGame, game, maxSpeed)
        futureGame = moveTowards(game, futureGame, maxSpeed)
      }
    },

    getPosition(): Dimensions {
      if (game === undefined) {
        throw new Error(
          "getPosition can't be called before calling update at least once"
        )
      }

      const delta = Rune.timeSinceLastUpdate() / Rune.msPerUpdate

      if (size !== -1) {
        return (game as number[]).map((curr, index) => {
          return lerp(curr, (futureGame as number[])[index], delta)
        }) as Dimensions
      }

      return lerp(game as number, futureGame as number, delta) as Dimensions
    },

    jump(jumpToGame: Dimensions) {
      previousGame = jumpToGame
      game = jumpToGame
      futureGame = jumpToGame
    },
  }
}
