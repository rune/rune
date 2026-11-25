import { describe, test, expect, beforeEach } from "@jest/globals"
import AdmZip from "adm-zip"
import fs from "fs"
import os from "os"
import path from "path"

import { zipProject } from "./zipProject"

let dir: string

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "rune-zip-"))
})

const write = (filePath: string, content = "x") => {
  fs.mkdirSync(path.dirname(path.join(dir, filePath)), { recursive: true })
  fs.writeFileSync(path.join(dir, filePath), content)
}

const zippedPaths = async () =>
  new AdmZip(await zipProject(dir))
    .getEntries()
    .map((entry) => entry.entryName)
    .sort()

describe("zipProject", () => {
  test("zips a project without a build step from its root, without rune.json, dotfiles or node_modules", async () => {
    write("index.html")
    write("logic.js")
    write("assets/a.png")
    write("rune.json", "{}")
    write(".DS_Store")
    write("node_modules/lib/index.js")

    expect(await zippedPaths()).toEqual([
      "assets/a.png",
      "index.html",
      "logic.js",
    ])
  })

  test("zips dist/ of a project with a Vite config", async () => {
    write("vite.config.js")
    write("rune.json", "{}")
    write("src/logic.js")
    write("dist/index.html")
    write("dist/logic.js")

    expect(await zippedPaths()).toEqual(["index.html", "logic.js"])
  })

  test("zips dist/ of a project with a build script", async () => {
    write("package.json", JSON.stringify({ scripts: { build: "tsc" } }))
    write("dist/index.html")

    expect(await zippedPaths()).toEqual(["index.html"])
  })

  test("refuses a build project that hasn't been built", async () => {
    write("vite.config.ts")
    write("index.html")

    await expect(zipProject(dir)).rejects.toThrow("Run your build first")
  })
})
