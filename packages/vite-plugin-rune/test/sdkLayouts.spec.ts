import { afterAll, beforeAll, describe, expect, it } from "@jest/globals"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import type { Plugin } from "vite"
import { getDevPlugins } from "../src/plugins/devPlugins.js"
import { getTransformHtmlForBuildPlugins } from "../src/plugins/transformHtml.js"

const runtimePublicPath = "/@rune-sdk"
const devRuntimeContents = "SDK_DEV_RUNTIME"

let tmpRoot: string

function createSdkPackage(version: string, files: Record<string, string>) {
  const packageRoot = mkdtempSync(path.join(tmpRoot, "rune-sdk-"))

  writeFileSync(
    path.join(packageRoot, "package.json"),
    JSON.stringify({ name: "rune-sdk", version })
  )

  for (const [file, contents] of Object.entries(files)) {
    const filePath = path.join(packageRoot, file)
    mkdirSync(path.dirname(filePath), { recursive: true })
    writeFileSync(filePath, contents)
  }

  return path.join(packageRoot, "package.json")
}

function createLegacySdkPackage() {
  return createSdkPackage("6.0.1", {
    "multiplayer-dev.js": devRuntimeContents,
    "multiplayer.js": "",
    "dist/logicRunner.js": "",
  })
}

function createCurrentSdkPackage() {
  return createSdkPackage("6.0.6", {
    "dist/multiplayer-dev.js": devRuntimeContents,
    "dist/multiplayer.js": "",
    "dist/logicRunner.js": "",
  })
}

function loadDevRuntime(runePkgPath: string, id: string) {
  const plugin = getDevPlugins(runePkgPath).find(
    (candidate) => candidate.name === "vite:rune-plugin:resolve-runtime"
  ) as Plugin
  const load = plugin.load as (id: string) => string | undefined

  return load(id)
}

function cdnScriptSrc(runePkgPath: string) {
  const [plugin] = getTransformHtmlForBuildPlugins(runePkgPath)
  const transformIndexHtml = plugin.transformIndexHtml as (html: string) => {
    tags: { attrs?: Record<string, unknown> }[]
  }
  const { tags } = transformIndexHtml("<html><head></head><body></body></html>")
  const cdnTag = tags.find((tag) => String(tag.attrs?.src).includes("jsdelivr"))

  return String(cdnTag?.attrs?.src)
}

beforeAll(() => {
  tmpRoot = mkdtempSync(path.join(os.tmpdir(), "sdk-layouts-"))
})

afterAll(() => {
  rmSync(tmpRoot, { recursive: true, force: true })
})

describe("dev runtime across rune-sdk layouts", () => {
  it("serves the runtime from dist/ for rune-sdk 6.0.2 and later", () => {
    expect(loadDevRuntime(createCurrentSdkPackage(), runtimePublicPath)).toBe(
      devRuntimeContents
    )
  })

  it("serves the runtime from the package root for rune-sdk 6.0.1", () => {
    expect(loadDevRuntime(createLegacySdkPackage(), runtimePublicPath)).toBe(
      devRuntimeContents
    )
  })

  it("ignores ids other than the runtime", () => {
    expect(
      loadDevRuntime(createCurrentSdkPackage(), "/some-other-module")
    ).toBeUndefined()
  })
})

describe("cdn script tag across rune-sdk layouts", () => {
  it("points at dist/ for rune-sdk 6.0.2 and later", () => {
    expect(cdnScriptSrc(createCurrentSdkPackage())).toBe(
      "https://cdn.jsdelivr.net/npm/rune-sdk@6.0.6/dist/multiplayer.js"
    )
  })

  it("points at the package root for rune-sdk 6.0.1", () => {
    expect(cdnScriptSrc(createLegacySdkPackage())).toBe(
      "https://cdn.jsdelivr.net/npm/rune-sdk@6.0.1/multiplayer.js"
    )
  })
})
