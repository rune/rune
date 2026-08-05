import { describe, expect, it } from "@jest/globals"
import type { OutputChunk, OutputAsset } from "rollup"
import { buildFixture } from "./buildFixture.js"

describe("build output", () => {
  it("basic project", async () => {
    const output = await buildFixture("basic")
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    expect(chunks).toHaveLength(2)
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()
    expect(logicChunk?.code).toContain("Rune.initLogic")
    expect(logicChunk?.code).not.toContain("document")
    const clientChunk = chunks.find((chunk) => chunk.fileName !== "logic.js")
    expect(clientChunk).toBeTruthy()
    expect(clientChunk?.code).not.toContain("Rune.initLogic")
    expect(clientChunk?.code).toContain("document.getElementById")

    const html = output.find((chunk) => chunk.type === "asset") as OutputAsset
    expect(html).toBeTruthy()
    expect(html.fileName).toBe("index.html")
    expect(html.source).toMatch(
      /<script src="https:\/\/cdn.jsdelivr.net\/npm\/rune-sdk@[^/"]+\/(dist\/)?multiplayer\.js"/
    )

    const logicScript = '<script type="module" crossorigin src="./logic.js">'
    const clientScript = '<script type="module" crossorigin src="./client.js">'
    expect(html.source).toContain(logicScript)
    expect(html.source).toContain(clientScript)

    expect((html.source as string).indexOf(logicScript)).toBeLessThan(
      (html.source as string).indexOf(clientScript)
    )
  })

  it("nested project", async () => {
    const output = await buildFixture("nested")
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    expect(chunks).toHaveLength(2)
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()
    expect(logicChunk?.code).toContain("Rune.initLogic")
    expect(logicChunk?.code).toContain("nested-string")
    expect(logicChunk?.code).not.toContain("Rune.initClient")
    expect(logicChunk?.code).not.toContain("client-only-string")
    const clientChunk = chunks.find((chunk) => chunk.fileName !== "logic.js")
    expect(clientChunk).toBeTruthy()
    expect(clientChunk?.code).toContain("client-only-string")
  })

  it("project with json script tags", async () => {
    const output = await buildFixture("json-scripts")
    const html = output.find(
      (chunk): chunk is OutputAsset => chunk.type === "asset"
    )
    expect(html).toBeTruthy()
    expect(html!.fileName).toBe("index.html")

    const lastScriptIndex = html!.source
      .toString()
      .lastIndexOf('<script type="application/json"')

    const sdkIndex = html!.source.toString().indexOf("multiplayer.js")
    const firstChunk = html!.source.toString().indexOf('<script type="module"')

    expect(lastScriptIndex).toBeGreaterThan(0)
    expect(lastScriptIndex).toBeLessThan(sdkIndex)
    expect(sdkIndex).toBeLessThan(firstChunk)
  })
})
