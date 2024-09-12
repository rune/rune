import { validateUpdateParams } from "../validation"
import { getDimensions, getPosition } from "../dimensions"
import { InterpolatorLatency } from "../types"

const runValidation = true

// one fo the points we're interpolating
type InterpolatedPoint = {
  // the current value for the point
  current: number
  // the speed the point is currently moving
  speed: number
  // the value the point is moving from
  from: number
  // the value the point is moving towards
  target: number
}

export function interpolatorLatency<Dimensions extends number | number[]>({
  maxSpeed,
  timeToMaxSpeed = 0,
}: {
  maxSpeed: number
  timeToMaxSpeed?: number
}): InterpolatorLatency<Dimensions> {
  let interpolated: InterpolatedPoint[] | undefined = undefined
  let futureInterpolated: InterpolatedPoint[] | undefined = undefined

  let size: number | null = null

  let acceleration = 0
  let useAcceleration = false

  function updateSpeed(point: InterpolatedPoint, componentCoefficient: number) {
    // if we're not using acceleration then we transition to max speed
    // all the time
    if (!useAcceleration) {
      return (
        Math.sign(point.target - point.current) *
        Math.min(Math.abs(maxSpeed), Math.abs(point.target - point.current)) *
        componentCoefficient
      )
    }

    // otherwise determine what speed the next steps should be at by applying
    // acceleration (or deceleration). Don't ever let the speed take us past
    // the end point or the maximum speed thats been allowed
    if (point.target > point.current) {
      return Math.min(
        point.speed + acceleration * componentCoefficient,
        maxSpeed * componentCoefficient,
        point.target - point.current
      )
    } else if (point.target < point.current) {
      return Math.max(
        point.speed - acceleration * componentCoefficient,
        -maxSpeed * componentCoefficient,
        point.target - point.current
      )
    } else {
      return 0
    }
  }

  function updatePoints(
    points: InterpolatedPoint[],
    target: Dimensions,
    size: number
  ): void {
    // work out the amount of change to apply on each axis. The max speed
    // is specified on the vector of movement so we need to only
    // move each axis/component the appropriate amount
    const valueDeltas =
      size === -1
        ? [(target as number) - points[0].current]
        : (target as number[]).map(
            (value, index) => value - points[index].current
          )
    const totalLength = Math.sqrt(
      valueDeltas.map((d) => d ** 2).reduce((p, v) => p + v, 0)
    )

    // update each point based on its acceleration and then its
    // speed
    points.forEach((point, index) => {
      point.from = point.current
      point.target =
        size == -1 ? (target as number) : (target as number[])[index]

      point.speed = updateSpeed(
        point,
        totalLength === 0 ? 0 : Math.abs(valueDeltas[index]) / totalLength
      )
      point.current = point.current + point.speed
    })
  }

  function asDimensions(
    points: InterpolatedPoint[] | undefined,
    size: number | null
  ): Dimensions | undefined {
    if (!points) {
      return undefined
    }

    if (size == -1) {
      return points[0].current as Dimensions
    } else {
      return points.map((p) => p.current) as Dimensions
    }
  }

  function createInterpolatedPoint(initialValue: number): InterpolatedPoint {
    return {
      current: initialValue,
      speed: 0,
      from: initialValue,
      target: initialValue,
    }
  }

  return {
    update(params: { game: Dimensions; futureGame: Dimensions }) {
      if (interpolated === undefined || futureInterpolated === undefined) {
        if (runValidation) {
          validateUpdateParams(params, size)
        }

        size = getDimensions(params.game)
        if (size == -1) {
          interpolated = [createInterpolatedPoint(params.game as number)]
          futureInterpolated = [
            createInterpolatedPoint(params.futureGame as number),
          ]
        } else {
          interpolated = []
          futureInterpolated = []
          for (let i = 0; i < size; i++) {
            interpolated.push(
              createInterpolatedPoint((params.game as number[])[i])
            )
            futureInterpolated.push(
              createInterpolatedPoint((params.futureGame as number[])[i])
            )
          }
        }

        if (timeToMaxSpeed > 0) {
          acceleration = maxSpeed / (timeToMaxSpeed / Rune.msPerUpdate)
          useAcceleration = true
        }

        return
      }

      // This value is set to true when `onChange` is called by `update` event.

      // @ts-ignore
      if (!Rune._isOnChangeCalledByUpdate) {
        return
      }

      if (runValidation) {
        validateUpdateParams(params, size)
      }

      if (size) {
        updatePoints(interpolated, params.game, size)
        updatePoints(futureInterpolated, params.futureGame, size)
      }
    },

    getPosition(): Dimensions {
      return getPosition<Dimensions>(
        asDimensions(interpolated, size),
        asDimensions(futureInterpolated, size),
        size
      )
    },

    jump(jumpToGame: Dimensions) {
      if (size == -1) {
        interpolated = [createInterpolatedPoint(jumpToGame as number)]
        futureInterpolated = [createInterpolatedPoint(jumpToGame as number)]
      } else if (size) {
        interpolated = []
        futureInterpolated = []
        for (let i = 0; i < size; i++) {
          interpolated.push(
            createInterpolatedPoint((jumpToGame as number[])[0])
          )
          futureInterpolated.push(
            createInterpolatedPoint((jumpToGame as number[])[0])
          )
        }
      }
    },
  }
}
