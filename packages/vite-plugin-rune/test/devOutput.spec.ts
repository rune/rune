import { describe, expect, it } from "@jest/globals"
import { buildDevFixture } from "./buildFixture.js"
import type { OutputAsset } from "rollup"

describe("JSON script tags in dev mode", () => {
  it("should move application/json script tags before SDK script", async () => {
    const output = await buildDevFixture("json-scripts")
    const html = output.find(
      (chunk): chunk is OutputAsset => chunk.type === "asset"
    )
    expect(html).toBeTruthy()
    expect(html!.fileName).toBe("index.html")

    const lastScriptIndex = html!.source
      .toString()
      .lastIndexOf('<script type="application/json"')

    const sdkIndex = html!.source
      .toString()
      .indexOf('<script src="/@rune-sdk">')
    const firstChunk = html!.source.toString().indexOf('<script type="module"')

    expect(lastScriptIndex).toBeGreaterThan(0)
    expect(lastScriptIndex).toBeLessThan(sdkIndex)
    expect(sdkIndex).toBeLessThan(firstChunk)
  })

  it("should handle HTML without JSON script tags", async () => {
    const output = await buildDevFixture("basic")
    const html = output.find(
      (chunk): chunk is OutputAsset => chunk.type === "asset"
    )
    expect(html).toBeTruthy()
    expect(html!.fileName).toBe("index.html")
    expect(html!.source.toString()).toContain('<script src="/@rune-sdk">')
    expect(
      html!.source.toString().indexOf('<script type="application/json"')
    ).toBe(-1)
  })
})
