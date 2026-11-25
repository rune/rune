import { describe, test, expect, beforeEach } from "@jest/globals"
import fs from "fs"
import os from "os"
import path from "path"

import { readProjectFile, writeProjectFile } from "./projectFile"

let dir: string

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "rune-project-"))
})

const projectJson = () =>
  JSON.parse(fs.readFileSync(path.join(dir, "rune.json"), "utf-8"))

describe("readProjectFile", () => {
  test("returns null when the folder has no rune.json", () => {
    expect(readProjectFile(dir)).toBeNull()
  })

  test("reads the game key and base", () => {
    fs.writeFileSync(
      path.join(dir, "rune.json"),
      JSON.stringify({ gameKey: "AbCd1234", base: "hash-1", other: true })
    )
    expect(readProjectFile(dir)).toEqual({
      gameKey: "AbCd1234",
      base: "hash-1",
    })
  })

  test("refuses invalid JSON, a missing game key or a bad base", () => {
    fs.writeFileSync(path.join(dir, "rune.json"), "{")
    expect(() => readProjectFile(dir)).toThrow("is not valid JSON")

    fs.writeFileSync(path.join(dir, "rune.json"), "[]")
    expect(() => readProjectFile(dir)).toThrow("must hold a JSON object")

    fs.writeFileSync(path.join(dir, "rune.json"), JSON.stringify({ base: "x" }))
    expect(() => readProjectFile(dir)).toThrow('has no "gameKey"')

    fs.writeFileSync(
      path.join(dir, "rune.json"),
      JSON.stringify({ gameKey: "AbCd1234" })
    )
    expect(() => readProjectFile(dir)).toThrow("a string or null")

    fs.writeFileSync(
      path.join(dir, "rune.json"),
      JSON.stringify({ gameKey: "AbCd1234", base: 1 })
    )
    expect(() => readProjectFile(dir)).toThrow("a string or null")
  })
})

describe("writeProjectFile", () => {
  test("writes a null base for a game with no checkpoint yet", () => {
    writeProjectFile(dir, { gameKey: "AbCd1234", base: null })
    expect(projectJson()).toEqual({ gameKey: "AbCd1234", base: null })
    expect(readProjectFile(dir)).toEqual({ gameKey: "AbCd1234", base: null })
  })

  test("creates rune.json", () => {
    writeProjectFile(dir, { gameKey: "AbCd1234", base: "hash-1" })
    expect(projectJson()).toEqual({ gameKey: "AbCd1234", base: "hash-1" })
  })

  test("keeps the file's other fields", () => {
    fs.writeFileSync(
      path.join(dir, "rune.json"),
      JSON.stringify({ gameKey: "AbCd1234", base: "hash-1", notes: "mine" })
    )
    writeProjectFile(dir, { gameKey: "AbCd1234", base: "hash-2" })
    expect(projectJson()).toEqual({
      gameKey: "AbCd1234",
      base: "hash-2",
      notes: "mine",
    })
  })
})
