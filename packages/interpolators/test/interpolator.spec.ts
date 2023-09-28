/* eslint-disable @typescript-eslint/ban-ts-comment */

import { interpolator } from "../src/interpolator/interpolator"

describe("interpolator", () => {
  it("should expect current & future to be defined & correct type", () => {
    global.Rune = {
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
    }

    const instance = interpolator()

    // @ts-ignore
    expect(() => instance.update()).toThrow(
      "current and future must be provided"
    )

    // @ts-ignore
    expect(() => instance.update(null)).toThrow(
      "current and future must be provided"
    )

    // @ts-ignore
    expect(() => instance.update({})).toThrow("current must be number or array")

    // @ts-ignore
    expect(() => instance.update({ current: [] })).toThrow(
      "future must be number or array"
    )

    expect(() => instance.update({ current: [], future: [] })).toThrow(
      "current & future must not be an empty array"
    )

    expect(() => instance.update({ current: 1, future: [] })).toThrow(
      "current is number, future must be number too"
    )

    expect(() => instance.update({ current: [], future: 1 })).toThrow(
      "current is array, future should be array too"
    )

    expect(() => instance.update({ current: [1], future: [1, 2] })).toThrow(
      "future length does not match current"
    )

    expect(() =>
      instance.update({ current: [1, null], future: [1, 2] })
    ).toThrow("current[1] must be a number")

    expect(() =>
      instance.update({ current: [1, 3], future: [null, 1] })
    ).toThrow("future[0] must be a number")

    expect(() => instance.update({ current: 1, future: 3 })).not.toThrow()
    expect(() => instance.update({ current: [1], future: [3] })).not.toThrow()
  })

  it("should not allow to call getPosition before calling update", () => {
    expect(() => interpolator().getPosition()).toThrow(
      "getPosition can't be called before calling update at least once"
    )
  })

  it("should interpolate between the positions when provided with numbers", () => {
    const instance = interpolator()

    global.Rune = {
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
    }

    instance.update({ current: 0, future: 10 })

    expect(instance.getPosition()).toEqual(0)

    global.Rune = {
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
    }

    expect(instance.getPosition()).toEqual(4)
  })

  it("should interpolate between the positions when provided with arrays", () => {
    const instance = interpolator()

    global.Rune = {
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
    }

    instance.update({ current: [0, 100], future: [10, 1000] })

    expect(instance.getPosition()).toEqual([0, 100])

    global.Rune = {
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
    }

    expect(instance.getPosition()).toEqual([4, 460])
  })

  it("should ignore update calls if _isOnChangeCalledByUpdate is false", () => {
    const instance = interpolator()

    global.Rune = {
      // @ts-ignore
      _isOnChangeCalledByUpdate: true,
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
    }

    instance.update({ current: 0, future: 10 })

    expect(instance.getPosition()).toEqual(4)

    global.Rune = {
      // @ts-ignore
      _isOnChangeCalledByUpdate: false,
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
    }

    instance.update({ current: 10, future: 100 })

    expect(instance.getPosition()).toEqual(4)
  })
})
