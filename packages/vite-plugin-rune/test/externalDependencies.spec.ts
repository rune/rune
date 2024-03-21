import { describe, expect, it } from "@jest/globals"

import { buildFixture, createLogger } from "./buildFixture.js"
import type { OutputChunk } from "rollup"

describe("external dependencies", () => {
  it("should detect an external dependency", async () => {
    const logger = createLogger()

    const output = await buildFixture("external-basic", logger)

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("External dependencies:\nmath-sum")
    )
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()
    expect(logicChunk?.code).toContain("/*! Imported dependencies: math-sum*/")
  })

  it("should detect an deeply nested external dependency", async () => {
    const logger = createLogger()

    const output = await buildFixture("external-nested", logger)

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("External dependencies:\narray-flatten")
    )
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()

    //This test also makes sure that math-sum imported by client.js is not detected
    //In this test deep file is imported both by client and by logic.
    //So in case we didn't handle this scenario, it would fail from time to time
    expect(logicChunk?.code).toContain(
      "/*! Imported dependencies: array-flatten*/"
    )
  })

  it("should ignore type imports", async () => {
    const logger = createLogger()

    const output = await buildFixture("external-type-import", logger)

    expect(logger.warn).not.toHaveBeenCalledWith()
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()

    expect(logicChunk?.code).not.toContain("/*! Imported dependencies")
  })

  it("should ignore whitelisted dependencies", async () => {
    const logger = createLogger()

    const output = await buildFixture("external-allowed", logger)

    expect(logger.warn).not.toHaveBeenCalledWith(
      expect.stringContaining("External dependencies:")
    )
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()

    expect(logicChunk?.code).toContain(
      "/*! Imported dependencies: sudoku-gen*/"
    )
  })

  it("should ignore dependencies passed in plugin options", async () => {
    const logger = createLogger()

    const output = await buildFixture("external-basic", logger, {
      ignoredDependencies: ["math-sum"],
    })

    expect(logger.warn).not.toHaveBeenCalledWith(
      expect.stringContaining("External dependencies:")
    )
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()

    expect(logicChunk?.code).toContain("/*! Imported dependencies: math-sum*/")
  })
})
