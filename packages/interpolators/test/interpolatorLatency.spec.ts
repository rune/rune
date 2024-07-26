import { interpolatorLatency } from "../src/interpolators/interpolatorLatency"

describe("interpolator", () => {
  it("should not allow to call getPosition before calling update", () => {
    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
    }

    expect(() => interpolatorLatency({ maxSpeed: 10 }).getPosition()).toThrow(
      "getPosition can't be called before calling update at least once"
    )
  })

  it("should interpolate between position using deceleration/acceleration to ease between changes in direction", () => {
    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    } as any

    const instance = interpolatorLatency({ maxSpeed: 5, timeToMaxSpeed: 1000 })

    instance.update({ game: 0, futureGame: 10 })
    expect(instance.getPosition()).toEqual(0)

    // we've accelerated to -0.5 velocity -(1000 / 5)
    instance.update({ game: -3, futureGame: -6 })
    expect(instance.getPosition()).toEqual(-0.5)

    // due to deceleration the change in velocity (speed) is
    // lerped

    // we've accelerated to -1 velocity -(1000 / 5)
    instance.update({ game: -3, futureGame: -6 })
    expect(instance.getPosition()).toEqual(-1.5)

    // CHANGE DIRECTION! we've decelerated to 0.5 velocity +(1000 / 5)
    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(-2)

    // we've decelerated to 0 velocity +(1000 / 5)
    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(-2)

    // we've decelerated to 0.5 velocity +(1000 / 5)
    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(-1.5)

    // we've decelerated to 1 velocity +(1000 / 5)
    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(-0.5)

    // we've decelerated to 1.5 velocity +(1000 / 5)
    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(1)
  })

  it("should interpolate between the positions midway between updates accounting for acceleration", () => {
    const instance = interpolatorLatency({ maxSpeed: 10, timeToMaxSpeed: 1000 })

    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 50,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    } as any

    // we've just started and we're 50% between game and future game
    // we're half way between 0 and 10, so should be a 5
    instance.update({ game: 0, futureGame: 10 })
    expect(instance.getPosition()).toEqual(5)

    // we're still moving in the same direction and have accelerated to 1 (future speed = 2)
    // we're half way between (0+1) and (10+2) = 6
    instance.update({ game: 10, futureGame: 20 })
    expect(instance.getPosition()).toEqual(6.5)

    // we're still moving in the same direction and have accelerated to 2 (future speed = 3)
    // we're half way between (1+2) and (12+3) = 9
    instance.update({ game: 20, futureGame: 30 })
    expect(instance.getPosition()).toEqual(9)

    // we're still moving in the same direction and have accelerated to 3 (future speed = 4)
    // we're half way between (3+3) and (15+4) = 12.5
    instance.update({ game: 30, futureGame: 40 })
    expect(instance.getPosition()).toEqual(12.5)

    // after running for a few more update we do eventually reach the right position
    for (let i = 0; i < 10; i++) {
      instance.update({ game: 40, futureGame: 40 })
    }
    expect(instance.getPosition()).toEqual(40)
  })

  it("should interpolate between the positions when provided with a multi-dimension array (multiple axis)", () => {
    const instance = interpolatorLatency({ maxSpeed: 10, timeToMaxSpeed: 1000 })

    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    } as any

    instance.update({ game: [0, 100], futureGame: [10, 1000] })

    expect(instance.getPosition()).toEqual([0, 100])

    instance.update({ game: [4, 100], futureGame: [10, 1000] })

    expect(instance.getPosition()).toEqual([1, 100])

    instance.update({ game: [4, 100], futureGame: [10, 1000] })
    expect(instance.getPosition()).toEqual([3, 100])
  })

  it("should decelerate and move back on change of direction", () => {
    const maxSpeed = 10
    const instance = interpolatorLatency<number>({
      maxSpeed,
      timeToMaxSpeed: 1000,
    })

    const dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    }

    ;(globalThis as any).Dusk = dusk

    instance.update({ game: 100, futureGame: 110 })
    expect(instance.getPosition()).toEqual(100)

    let x = 100

    // should be at full speed going right now
    const beforeSpeedUp = instance.getPosition()
    x += 10
    instance.update({ game: x, futureGame: x + 10 })
    const speedUp = instance.getPosition() - beforeSpeedUp
    // we accelerate to speed 10 over 1000ms, we've had 100ms, so we should
    // be at speed = 1
    expect(speedUp).toEqual(1)

    // travel to the right for a bit
    for (let i = 0; i < 20; i++) {
      x += 10
      instance.update({ game: x, futureGame: x + 10 })
    }

    // should be at full speed going right now
    const beforeFullSpeed = instance.getPosition()
    x += 10
    instance.update({ game: x, futureGame: x + 10 })
    const fullSpeed = instance.getPosition() - beforeFullSpeed
    expect(fullSpeed).toEqual(10)

    // start moving back to the left
    const beforeLeft = instance.getPosition()
    instance.update({ game: x, futureGame: x - 10 })
    const leftSpeed = instance.getPosition() - beforeLeft
    expect(leftSpeed).toEqual(10)

    // travel to the right for a bit - bare in mind we'll need
    for (let i = 0; i < 20; i++) {
      x -= 10
      instance.update({ game: x, futureGame: x - 10 })
    }

    // we've been decelerating and should now be just about (1 step off)
    // the full speed in the other direction
    const beforeLastStep = instance.getPosition()
    x -= 10
    instance.update({ game: x, futureGame: x - 10 })
    const lastStepSpeed = instance.getPosition() - beforeLastStep
    expect(lastStepSpeed).toEqual(-9)

    // should be at full speed going right now
    const beforeLeftFullSpeed = instance.getPosition()
    x -= 10
    instance.update({ game: x, futureGame: x - 10 })
    const fullLeftSpeed = instance.getPosition() - beforeLeftFullSpeed
    expect(fullLeftSpeed).toEqual(-10)

    // change direction again to make sure we don't have negative/positive
    // bugs

    // start moving back to the right
    const beforeRight = instance.getPosition()
    instance.update({ game: x, futureGame: x + 10 })
    const rightSpeed = instance.getPosition() - beforeRight
    expect(rightSpeed).toEqual(-10)

    // travel to the right for a bit - the extra 7 steps here
    // is to give the target of the interpolator time to catch up
    // Since we're using max-speed=10 and we're actually moving at
    // 10 the interpolator will get behind
    for (let i = 0; i < 27; i++) {
      x += 10
      instance.update({ game: x, futureGame: x + 10 })
    }

    // we've been decelerating and should now be just about (1 step off)
    // the full speed in the other direction
    const beforeLastRightStep = instance.getPosition()
    x += 10
    instance.update({ game: x, futureGame: x + 10 })
    const lastStepRightSpeed = instance.getPosition() - beforeLastRightStep
    expect(lastStepRightSpeed).toEqual(9)

    // should be at full speed going right now
    const beforeRightFullSpeed = instance.getPosition()
    x += 10
    instance.update({ game: x, futureGame: x + 10 })
    const fullRightSpeed = instance.getPosition() - beforeRightFullSpeed
    expect(fullRightSpeed).toEqual(10)
  })

  it("should decelerate and move back on change of direction - two dimensions", () => {
    const maxSpeed = 10
    const instance = interpolatorLatency({
      // we're going to allow movement of up to maxSpeed in both x and y components
      // note: this will introduce some rounding errors which we'll account for
      // below in the tests
      maxSpeed: Math.sqrt(maxSpeed ** 2 * 2),
      timeToMaxSpeed: 1000,
    })

    const dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    }

    ;(globalThis as any).Dusk = dusk

    instance.update({ game: [100, 100], futureGame: [110, 90] })
    expect(instance.getPosition()).toEqual([100, 100])

    let x = 100
    let y = 100

    // should be at full speed going right now
    const beforeSpeedUp = instance.getPosition()[0]
    x += 10
    y -= 10
    instance.update({ game: [x, y], futureGame: [x + 10, y - 10] })
    const speedUp = instance.getPosition()[0] - beforeSpeedUp
    // we accelerate to speed 10 over 1000ms, we've had 100ms, so we should
    // be at speed = 1
    expect(speedUp).toEqual(1)

    // travel to the right for a bit
    for (let i = 0; i < 20; i++) {
      x += 10
      y -= 10
      instance.update({ game: [x, y], futureGame: [x + 10, y - 10] })
    }

    // should be at full speed going right now
    const beforeFullSpeed = instance.getPosition()[0]
    x += 10
    y -= 10
    instance.update({ game: [x, y], futureGame: [x + 10, y - 10] })
    const fullSpeed = instance.getPosition()[0] - beforeFullSpeed
    expect(fullSpeed).toEqual(10)

    // start moving back to the left
    const beforeLeft = instance.getPosition()[0]
    instance.update({ game: [x, y], futureGame: [x - 10, y + 10] })
    const leftSpeed = instance.getPosition()[0] - beforeLeft
    expect(leftSpeed).toEqual(10)

    // travel to the right for a bit - bare in mind we'll need
    for (let i = 0; i < 20; i++) {
      x -= 10
      y += 10
      instance.update({ game: [x, y], futureGame: [x - 10, y + 10] })
    }

    // we've been decelerating and should now be just about (1 step off)
    // the full speed in the other direction
    const beforeLastStep = instance.getPosition()[0]
    x -= 10
    y += 10
    instance.update({ game: [x, y], futureGame: [x - 10, y + 10] })
    const lastStepSpeed = instance.getPosition()[0] - beforeLastStep
    expect(lastStepSpeed).toEqual(-9)

    // should be at full speed going right now
    const beforeLeftFullSpeed = instance.getPosition()[0]
    x -= 10
    y += 10
    instance.update({ game: [x, y], futureGame: [x - 10, y + 10] })
    const fullLeftSpeed = instance.getPosition()[0] - beforeLeftFullSpeed
    expect(fullLeftSpeed).toEqual(-10)

    // change direction again to make sure we don't have negative/positive
    // bugs

    // start moving back to the right
    const beforeRight = instance.getPosition()[0]
    instance.update({ game: [x, y], futureGame: [x + 10, y - 10] })
    const rightSpeed = instance.getPosition()[0] - beforeRight
    expect(rightSpeed).toEqual(-10)

    // travel to the right for a bit - the extra 7 steps here
    // is to give the target of the interpolator time to catch up
    // Since we're using max-speed=10 and we're actually moving at
    // 10 the interpolator will get behind
    for (let i = 0; i < 27; i++) {
      x += 10
      y -= 10
      instance.update({ game: [x, y], futureGame: [x + 10, y - 10] })
    }

    // we've been decelerating and should now be just about (1 step off)
    // the full speed in the other direction
    const beforeLastRightStep = instance.getPosition()[0]
    x += 10
    y += 10
    instance.update({ game: [x, y], futureGame: [x + 10, y - 10] })
    const lastStepRightSpeed = instance.getPosition()[0] - beforeLastRightStep
    // account for rounding errors om diagonal movement
    expect(Math.abs(lastStepRightSpeed) - 9).toBeLessThan(0.2)

    // should be at full speed going right now
    const beforeRightFullSpeed = instance.getPosition()[0]
    x += 10
    y -= 10
    instance.update({ game: [x, y], futureGame: [x + 10, y - 10] })
    const fullRightSpeed = instance.getPosition()[0] - beforeRightFullSpeed
    // account for rounding errors om diagonal movement
    expect(Math.abs(fullRightSpeed) - 10).toBeLessThan(0.2)
  })

  it("should not see large jumps in movement", () => {
    const maxSpeed = 10
    const instance = interpolatorLatency({ maxSpeed })

    const dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    }

    ;(globalThis as any).Dusk = dusk

    instance.update({ game: [100, 100], futureGame: [110, 100] })
    expect(instance.getPosition()).toEqual([100, 100])
    instance.update({ game: [110, 100], futureGame: [120, 100] })
    expect(instance.getPosition()).toEqual([110, 100])

    // theres a delay, 300ms
    instance.update({ game: [120, 100], futureGame: [120, 100] })
    instance.update({ game: [130, 100], futureGame: [130, 100] })
    instance.update({ game: [140, 100], futureGame: [140, 100] })

    expect(instance.getPosition()).toEqual([140, 100])

    // now we get an action that we can use to calculate the player
    // is in a very different place (they moved up the screen at the point
    // the delay happened for 300ms)
    dusk._isOnChangeCalledByUpdate = false
    instance.update({ game: [110, 70], futureGame: [110, 60] })
    const lastRenderPos = instance.getPosition()
    dusk._isOnChangeCalledByUpdate = true
    instance.update({ game: [110, 60], futureGame: [110, 50] })
    const newRenderPos = instance.getPosition()
    const dx = lastRenderPos[0] - newRenderPos[0]
    const dy = lastRenderPos[1] - newRenderPos[1]
    const changeInDistance = Math.sqrt(dx * dx + dy * dy)

    expect(changeInDistance).toBeLessThanOrEqual(maxSpeed)
    expect(instance.getPosition()).toEqual([134, 92])
  })

  it("should ignore update calls if _isOnChangeCalledByUpdate is false", () => {
    const instance = interpolatorLatency({ maxSpeed: 10, timeToMaxSpeed: 1000 })

    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      timeSinceLastUpdate: () => 40,
    }

    instance.update({ game: 0, futureGame: 10 })

    expect(instance.getPosition()).toEqual(4)
    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
      // @ts-ignore
      _isOnChangeCalledByUpdate: false,
    }

    instance.update({ game: 10, futureGame: 100 })

    expect(instance.getPosition()).toEqual(4)
  })

  it("should not go above maxSpeed", () => {
    const instance = interpolatorLatency({ maxSpeed: 3, timeToMaxSpeed: 200 })

    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      timeSinceLastUpdate: () => 0,
    }

    instance.update({ game: 0, futureGame: 20 })
    expect(instance.getPosition()).toEqual(0)

    instance.update({ game: 20, futureGame: 20 })
    expect(instance.getPosition()).toEqual(1.5)

    //Max speed is reached, it does not go above it
    instance.update({ game: 20, futureGame: 20 })
    expect(instance.getPosition()).toEqual(4.5)

    instance.update({ game: 20, futureGame: 20 })
    expect(instance.getPosition()).toEqual(7.5)

    instance.update({ game: 20, futureGame: 20 })
    expect(instance.getPosition()).toEqual(10.5)

    instance.update({ game: 20, futureGame: 20 })
    expect(instance.getPosition()).toEqual(13.5)
  })

  it("should take into consideration timeToMaxSpeed - negative", () => {
    const instanceNegative200ms = interpolatorLatency({
      maxSpeed: 10,
      timeToMaxSpeed: 200,
    })

    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      timeSinceLastUpdate: () => 0,
    }

    instanceNegative200ms.update({ game: 0, futureGame: -20 })

    expect(instanceNegative200ms.getPosition()).toEqual(0)
    instanceNegative200ms.update({ game: -20, futureGame: -20 })
    expect(instanceNegative200ms.getPosition()).toEqual(-5)

    instanceNegative200ms.update({ game: -20, futureGame: -20 })
    expect(instanceNegative200ms.getPosition()).toEqual(-15)
  })

  it("should take into consideration timeToMaxSpeed", () => {
    const instanceOneSecond = interpolatorLatency({
      maxSpeed: 10,
      timeToMaxSpeed: 1000,
    })
    const instance200ms = interpolatorLatency({
      maxSpeed: 10,
      timeToMaxSpeed: 200,
    })

    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      timeSinceLastUpdate: () => 0,
    }

    instanceOneSecond.update({ game: 0, futureGame: 20 })
    instance200ms.update({ game: 0, futureGame: 20 })

    expect(instanceOneSecond.getPosition()).toEqual(0)
    expect(instance200ms.getPosition()).toEqual(0)

    instanceOneSecond.update({ game: 20, futureGame: 20 })
    instance200ms.update({ game: 20, futureGame: 20 })
    expect(instanceOneSecond.getPosition()).toEqual(1)
    expect(instance200ms.getPosition()).toEqual(5)

    instanceOneSecond.update({ game: 20, futureGame: 20 })
    instance200ms.update({ game: 20, futureGame: 20 })
    expect(instanceOneSecond.getPosition()).toEqual(3)
    expect(instance200ms.getPosition()).toEqual(15)
  })

  it("should not use acceleration by default", () => {
    const instance = interpolatorLatency({ maxSpeed: 3 })

    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      timeSinceLastUpdate: () => 0,
    }

    instance.update({ game: 0, futureGame: 20 })
    expect(instance.getPosition()).toEqual(0)

    instance.update({ game: 20, futureGame: 20 })
    expect(instance.getPosition()).toEqual(3)
  })

  it("should only move max speed with multiple axis", () => {
    const instance = interpolatorLatency<number[]>({ maxSpeed: 10 })

    ;(globalThis as any).Dusk = {
      msPerUpdate: 100,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      timeSinceLastUpdate: () => 0,
    }

    instance.update({ game: [0, 0], futureGame: [0, 10] })
    expect(instance.getPosition()).toEqual([0, 0])

    // should move the full 10 in a straight line
    instance.update({ game: [0, 10], futureGame: [0, 20] })
    expect(instance.getPosition()).toEqual([0, 10])
    // should move the full 10 in a straight line
    instance.update({ game: [10, 10], futureGame: [20, 10] })
    expect(instance.getPosition()).toEqual([10, 10])
    // should move the full 10 in a straight line
    instance.update({ game: [20, 20], futureGame: [30, 30] })
    const componentDistance = Math.sqrt((10 * 10) / 2)
    expect(instance.getPosition()).toEqual([
      10 + componentDistance,
      10 + componentDistance,
    ])
  })
})
