/*
Reimport of the Rune module between every test to reset it.
*/

import * as src from "../src"

let Rune: src.RuneExport

beforeEach(() => {
  return import("../src").then((module) => {
    Rune = module.Rune
    jest.resetModules()
  })
})

export { Rune }
