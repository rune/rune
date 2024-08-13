import { describe, expect, it, jest } from "@jest/globals"

import { buildFixture, createLogger } from "./buildFixture.js"
import type { OutputChunk } from "rollup"

describe("external dependencies", () => {
  it("should detect an external dependency", async () => {
    //This test also verifies that loading json files in logic works

    const logger = createLogger()

    const output = await buildFixture("external-basic", logger)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("math-sum")
    )
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()
    expect(logicChunk?.code).toContain("/*! Imported dependencies: math-sum*/")
  })

  it("should gracefully handle circular dependencies", async () => {
    const logger = createLogger()

    const output = await buildFixture("circular", logger)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("math-sum")
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

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("array-flatten")
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

    expect(logger.error).not.toHaveBeenCalledWith("vite")
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

    expect(logger.error).not.toHaveBeenCalledWith(
      expect.stringContaining("sudoku-gen")
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

    expect(logger.error).not.toHaveBeenCalledWith(
      expect.stringContaining("math-sum")
    )
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()

    expect(logicChunk?.code).toContain("/*! Imported dependencies: math-sum*/")
  })

  it("should ignore dependencies passed in plugin options, matching only the start of the import", async () => {
    const logger = createLogger()

    const output = await buildFixture("external-basic", logger, {
      ignoredDependencies: ["math-"],
    })

    expect(logger.error).not.toHaveBeenCalledWith(
      expect.stringContaining("math-sum")
    )
    const chunks = output.filter(
      (chunk) => chunk.type === "chunk"
    ) as OutputChunk[]
    const logicChunk = chunks.find((chunk) => chunk.fileName === "logic.js")
    expect(logicChunk).toBeTruthy()

    expect(logicChunk?.code).toContain("/*! Imported dependencies: math-sum*/")
  })

  it("should allow relative imports", async () => {
    const logger = createLogger()

    await buildFixture("external-basic", logger, {
      ignoredDependencies: ["math-sum"],
    })

    expect(logger.error).not.toHaveBeenCalledWith(
      expect.stringContaining("inner")
    )
    expect(logger.error).not.toHaveBeenCalledWith(
      expect.stringContaining("outer")
    )
  })

  it("should not allow to include assets in logic file", async () => {
    const logger = createLogger()

    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any)

    await buildFixture("nested-assets", logger, {
      ignoredDependencies: ["math-sum"],
    })

    expect(mockExit).toHaveBeenCalledWith(1)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Assets are not allowed in Dusk logic file.
File: ./logo.svg was imported by:
./nested
./shared/deep
./shared/helpers.js`)
    )
  })
})
