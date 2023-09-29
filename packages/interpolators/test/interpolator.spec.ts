/* eslint-disable @typescript-eslint/ban-ts-comment */

import { interpolator } from "../src/interpolator"

describe("interpolator", () => {
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
