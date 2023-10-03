/* eslint-disable @typescript-eslint/ban-ts-comment */

import { interpolator } from "../src/interpolators/interpolator"

describe("interpolator", () => {
  it("should not allow to call getPosition before calling update", () => {
    expect(() => interpolator().getPosition()).toThrow(
      "getPosition can't be called before calling update at least once"
    )
  })

  it("should interpolate between the positions when provided with numbers", () => {
    const instance = interpolator()

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
    } as any

    instance.update({ game: 0, futureGame: 10 })

    expect(instance.getPosition()).toEqual(0)

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
    } as any

    expect(instance.getPosition()).toEqual(4)
  })

  it("should interpolate between the positions when provided with arrays", () => {
    const instance = interpolator()

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 0,
    } as any

    instance.update({ game: [0, 100], futureGame: [10, 1000] })

    expect(instance.getPosition()).toEqual([0, 100])

    global.Rune = {
      msPerUpdate: 100,
      timeSinceLastUpdate: () => 40,
    } as any

    expect(instance.getPosition()).toEqual([4, 460])
  })
})
