import { validateUpdateParams } from "../validation"
import { getDimensions, getPosition } from "../dimensions"
import { InterpolatorLatency } from "../types"

const runValidation = true

function moveTowardsSingleValue(from: number, to: number, maxSpeed: number) {
  const distance = to - from

  // max speed can be the opposite sign of the direction we want
  // to travel, this will mean we're in deceleration
  if (Math.sign(maxSpeed) !== Math.sign(distance)) {
    // we're decelerating so just move the speed given
    return from + maxSpeed
  }

  // otherwise we're speeding in the right direction so pick either
  // move speed or if we're close enough just move to the target
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
  timeToMaxSpeed = 0,
}: {
  maxSpeed: number
  timeToMaxSpeed?: number
}): InterpolatorLatency<Dimensions> {
  let interpolated: Dimensions | undefined = undefined
  let futureInterpolated: Dimensions | undefined = undefined

  let speed: Dimensions | undefined

  let size: number | null = null

  let acceleration = 0
  let useAcceleration = false

  function calculateSpeedSingleValue(
    interpolated: number,
    target: number,
    currentSpeed: number,
    componentCoefficient: number
  ) {
    if (!useAcceleration) {
      return Math.sign(target - interpolated) * maxSpeed * componentCoefficient
    }

    if (target > interpolated) {
      return Math.min(
        currentSpeed + acceleration * componentCoefficient,
        maxSpeed * componentCoefficient
      )
    } else if (target < interpolated) {
      return Math.max(
        currentSpeed - acceleration * componentCoefficient,
        -maxSpeed * componentCoefficient
      )
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
        speed as number,
        1
      ) as Dimensions
    } else {
      const valueDeltas = (target as number[]).map(
        (value, index) => value - (interpolated as number[])[index]
      )
      const totalLength = Math.sqrt(
        valueDeltas.map((d) => d ** 2).reduce((p, v) => p + v, 0)
      )

      return (interpolated as number[]).map((interpolatedValue, index) => {
        return calculateSpeedSingleValue(
          interpolatedValue,
          (target as number[])[index],
          (speed as number[])[index] ?? 0,
          totalLength === 0 ? 0 : Math.abs(valueDeltas[index]) / totalLength
        )
      }) as Dimensions
    }
  }

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

        if (timeToMaxSpeed > 0) {
          acceleration = maxSpeed / (timeToMaxSpeed / Dusk.msPerUpdate)
          useAcceleration = true
        }

        return
      }

      // This value is set to true when `onChange` is called by `update` event.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!Dusk._isOnChangeCalledByUpdate) {
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
      if (futureInterpolated) {
        futureInterpolated = moveTowards(
          futureInterpolated,
          params.futureGame,
          calculateSpeed(futureInterpolated, params.futureGame),
          size as number
        )
      }
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
