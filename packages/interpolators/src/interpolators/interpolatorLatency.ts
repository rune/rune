import { validateUpdateParams } from "../validation"
import { getDimensions, getPosition } from "../dimensions"

const runValidation = true

function moveTowardsSingleValue(from: number, to: number, maxSpeed: number) {
  const distance = to - from

  const distanceToMove = Math.min(Math.abs(distance), Math.abs(maxSpeed))

  return from + distanceToMove * Math.sign(distance)
}

function moveTowards<Dimensions extends number | number[]>(
  from: Dimensions,
  to: Dimensions,
  speed: Dimensions,
  size: number
): Dimensions {
  if (size > 0) {
    return (from as number[]).map((fromElement, index) =>
      moveTowardsSingleValue(
        fromElement,
        (to as number[])[index],
        (speed as number[])[index]
      )
    ) as Dimensions
  }

  return moveTowardsSingleValue(
    from as number,
    to as number,
    speed as number
  ) as Dimensions
}

export function interpolatorLatency<Dimensions extends number | number[]>({
  maxSpeed,
  timeToMaxSpeed = 1000,
}: {
  maxSpeed: number
  timeToMaxSpeed?: number
}) {
  let interpolated: Dimensions | undefined = undefined
  let futureInterpolated: Dimensions | undefined = undefined

  let speed: Dimensions | undefined

  let size: number | null = null

  function calculateSpeedSingleValue(
    interpolated: number,
    target: number,
    currentSpeed: number
  ) {
    if (target > interpolated) {
      return Math.min(Math.max(currentSpeed, 0) + acceleration, maxSpeed)
    } else if (target < interpolated) {
      return Math.max(Math.min(currentSpeed, 0) - acceleration, -maxSpeed)
    } else {
      return 0
    }
  }

  function getDefaultSpeed(): Dimensions {
    return (
      size === -1 ? 0 : (interpolated as number[]).map(() => 0)
    ) as Dimensions
  }

  function calculateSpeed(
    interpolated: Dimensions,
    target: Dimensions
  ): Dimensions {
    if (size === -1) {
      return calculateSpeedSingleValue(
        interpolated as number,
        target as number,
        speed as number
      ) as Dimensions
    } else {
      return (interpolated as number[]).map((interpolatedValue, index) => {
        return calculateSpeedSingleValue(
          interpolatedValue,
          (target as number[])[index],
          (speed as number[])[index] ?? 0
        )
      }) as Dimensions
    }
  }

  let updatesToMaxSpeed = 0
  let acceleration = 0

  return {
    update(params: { game: Dimensions; futureGame: Dimensions }) {
      if (interpolated === undefined) {
        if (runValidation) {
          validateUpdateParams(params, size)
        }

        interpolated = params.game
        futureInterpolated = params.futureGame

        size = getDimensions(params.game)
        speed = getDefaultSpeed()

        updatesToMaxSpeed = Math.floor(timeToMaxSpeed / Rune.msPerUpdate)

        acceleration = maxSpeed / updatesToMaxSpeed

        return
      }

      // This value is set to true when `onChange` is called by `update` event.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!Rune._isOnChangeCalledByUpdate) {
        return
      }

      if (runValidation) {
        validateUpdateParams(params, size)
      }

      speed = calculateSpeed(interpolated, params.game)

      interpolated = moveTowards(
        interpolated,
        params.game,
        speed,
        size as number
      )
      futureInterpolated = moveTowards(
        interpolated,
        params.futureGame,
        speed,
        size as number
      )
    },

    getPosition(): Dimensions {
      return getPosition<Dimensions>(interpolated, futureInterpolated, size)
    },

    jump(jumpToGame: Dimensions) {
      interpolated = jumpToGame
      futureInterpolated = jumpToGame
      speed = getDefaultSpeed()
    },
  }
}
