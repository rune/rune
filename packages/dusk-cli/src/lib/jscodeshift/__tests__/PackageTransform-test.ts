import { describe, it, expect } from "@jest/globals"
import transformJSON from "../PackageTransform"
import path from "path"
import fs from "fs"

describe("PackageJSONTransform", () => {
  it("should transform package", () => {
    expect(
      JSON.stringify(
        transformJSON(
          require(path.resolve(
            __dirname,
            "../__testfixtures__/testPackage.input.json"
          ))
        ),
        null,
        2
      )
    ).toEqual(
      fs.readFileSync(
        path.resolve(__dirname, "../__testfixtures__/testPackage.output.json"),
        "utf-8"
      )
    )
  })
})
