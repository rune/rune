/* eslint-disable @typescript-eslint/ban-ts-comment */

import { interpolatorLatency } from "../src/interpolators/interpolatorLatency"

describe("interpolator", () => {
  it("should not allow to call getPosition before calling update", () => {
    expect(() => interpolatorLatency({ maxSpeed: 10 }).getPosition()).toThrow(
      "getPosition can't be called before calling update at least once"
    )
  })

  it("should interpolate between the positions when provided with numbers", () => {
    const instance = interpolatorLatency({ maxSpeed: 5 })

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    } as any

    instance.update({ game: 0, futureGame: 10 })
    expect(instance.getPosition()).toEqual(0)

    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(5)

    instance.update({ game: 12, futureGame: 15 })
    expect(instance.getPosition()).toEqual(10)

    instance.update({ game: 15, futureGame: 14 })
    expect(instance.getPosition()).toEqual(15)

    instance.update({ game: 14, futureGame: 14 })
    expect(instance.getPosition()).toEqual(14)
  })

  it("should interpolate between the positions when provided with numbers & timeSinceLastUpdate is not 0", () => {
    const instance = interpolatorLatency({ maxSpeed: 5 })

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 50,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    } as any

    instance.update({ game: 0, futureGame: 10 })
    expect(instance.getPosition()).toEqual(5)

    instance.update({ game: 10, futureGame: 12 })
    expect(instance.getPosition()).toEqual(7.5)

    instance.update({ game: 12, futureGame: 15 })
    expect(instance.getPosition()).toEqual(12.5)

    instance.update({ game: 15, futureGame: 14 })
    expect(instance.getPosition()).toEqual(14.5)

    instance.update({ game: 14, futureGame: 14 })
    expect(instance.getPosition()).toEqual(14)
  })

  it("should interpolate between the positions when provided with arrays", () => {
    const instance = interpolatorLatency({ maxSpeed: 10 })

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    } as any

    instance.update({ game: [0, 100], futureGame: [10, 1000] })

    expect(instance.getPosition()).toEqual([0, 100])

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
    } as any

    expect(instance.getPosition()).toEqual([4, 460])
  })

  it("should ignore update calls if _isOnChangeCalledByUpdate is false", () => {
    const instance = interpolatorLatency({ maxSpeed: 10 })

    global.Rune = {
      msPerUpdate: 100,
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      timeSinceLastUpdate: () => 40,
    }

    instance.update({ game: 0, futureGame: 10 })

    expect(instance.getPosition()).toEqual(4)

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
      // @ts-ignore
      _isOnChangeCalledByUpdate: false,
    }

    instance.update({ game: 10, futureGame: 100 })

    expect(instance.getPosition()).toEqual(4)
  })
})
