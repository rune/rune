/* eslint-disable @typescript-eslint/ban-ts-comment */

import { interpolatorLatency } from "../src/interpolators/interpolatorLatency"

describe("interpolator", () => {
  it("should not allow to call getPosition before calling update", () => {
    global.Dusk = {
      msPerUpdate: 100,
    } as any

    expect(() => interpolatorLatency({ maxSpeed: 10 }).getPosition()).toThrow(
      "getPosition can't be called before calling update at least once"
    )
  })

  it("should interpolate between the positions when provided with numbers", () => {
    global.Dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    } as any

    const instance = interpolatorLatency({ maxSpeed: 5, timeToMaxSpeed: 1000 })

    instance.update({ game: 0, futureGame: 10 })
    expect(instance.getPosition()).toEqual(0)

    instance.update({ game: -3, futureGame: -6 })
    expect(instance.getPosition()).toEqual(-0.5)

    instance.update({ game: -3, futureGame: -6 })
    expect(instance.getPosition()).toEqual(-1.5)

    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(-1)

    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(0)

    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(1.5)

    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(3.5)

    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(6)
  })

  it("should interpolate between the positions when provided with numbers & timeSinceLastUpdate is not 0", () => {
    const instance = interpolatorLatency({ maxSpeed: 5, timeToMaxSpeed: 1000 })

    global.Dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 50,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    } as any

    instance.update({ game: 0, futureGame: 10 })
    expect(instance.getPosition()).toEqual(5)

    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(0.75)

    instance.update({ game: 12, futureGame: 15 })
    expect(instance.getPosition()).toEqual(2)

    instance.update({ game: 14, futureGame: 14 })
    expect(instance.getPosition()).toEqual(3.75)
  })

  it("should interpolate between the positions when provided with arrays", () => {
    const instance = interpolatorLatency({ maxSpeed: 10, timeToMaxSpeed: 1000 })

    global.Dusk = {
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

  it("should not see large jumps in movement", () => {
    const maxSpeed = 10
    const instance = interpolatorLatency({ maxSpeed })

    const dusk = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    }

    global.Dusk = dusk

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

    global.Dusk = {
      msPerUpdate: 100,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      timeSinceLastUpdate: () => 40,
    }

    instance.update({ game: 0, futureGame: 10 })

    expect(instance.getPosition()).toEqual(4)

    global.Dusk = {
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

    global.Dusk = {
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

    global.Dusk = {
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

    global.Dusk = {
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

    global.Dusk = {
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
})
