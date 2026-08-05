import { afterAll, beforeAll, describe, expect, it } from "@jest/globals"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { resolveSdkAsset } from "../src/lib/resolveSdkAsset.js"

const assetFileName = "multiplayer-dev.js"

let tmpRoot: string

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function createSdkPackage(version: string, files: string[]) {
  const packageRoot = mkdtempSync(path.join(tmpRoot, "rune-sdk-"))

  writeFileSync(
    path.join(packageRoot, "package.json"),
    JSON.stringify({ name: "rune-sdk", version })
  )

  for (const file of files) {
    const filePath = path.join(packageRoot, file)
    mkdirSync(path.dirname(filePath), { recursive: true })
    writeFileSync(filePath, file)
  }

  return path.join(packageRoot, "package.json")
}

beforeAll(() => {
  tmpRoot = mkdtempSync(path.join(os.tmpdir(), "resolve-sdk-asset-"))
})

afterAll(() => {
  rmSync(tmpRoot, { recursive: true, force: true })
})

describe("resolveSdkAsset", () => {
  it("resolves assets from dist/ for rune-sdk 6.0.2 and later", () => {
    const runePkgPath = createSdkPackage("6.0.6", [
      `dist/${assetFileName}`,
      "dist/logicRunner.js",
    ])

    const asset = resolveSdkAsset(runePkgPath, assetFileName)

    expect(asset.packageSubPath).toBe(`dist/${assetFileName}`)
    expect(asset.absolutePath).toBe(
      path.join(path.dirname(runePkgPath), "dist", assetFileName)
    )
  })

  it("resolves assets from the package root for rune-sdk 6.0.1", () => {
    const runePkgPath = createSdkPackage("6.0.1", [assetFileName])

    const asset = resolveSdkAsset(runePkgPath, assetFileName)

    expect(asset.packageSubPath).toBe(assetFileName)
    expect(asset.absolutePath).toBe(
      path.join(path.dirname(runePkgPath), assetFileName)
    )
  })

  it("falls back to the package root when dist/ exists without the asset", () => {
    const runePkgPath = createSdkPackage("6.0.1", [
      "dist/logicRunner.js",
      "dist/gameClient.js",
      assetFileName,
    ])

    const asset = resolveSdkAsset(runePkgPath, assetFileName)

    expect(asset.packageSubPath).toBe(assetFileName)
  })

  it("prefers dist/ when both locations have the asset", () => {
    const runePkgPath = createSdkPackage("6.0.6", [
      assetFileName,
      `dist/${assetFileName}`,
    ])

    const asset = resolveSdkAsset(runePkgPath, assetFileName)

    expect(asset.packageSubPath).toBe(`dist/${assetFileName}`)
  })

  it("returns a url friendly subpath regardless of platform", () => {
    const runePkgPath = createSdkPackage("6.0.6", [`dist/${assetFileName}`])

    const asset = resolveSdkAsset(runePkgPath, assetFileName)

    expect(asset.packageSubPath).not.toContain("\\")
  })

  it("throws with the probed locations when the asset is missing", () => {
    const runePkgPath = createSdkPackage("6.0.7", ["dist/logicRunner.js"])
    const packageRoot = path.dirname(runePkgPath)

    expect(() => resolveSdkAsset(runePkgPath, assetFileName)).toThrow(
      new RegExp(
        [
          `Cannot find "${escapeRegExp(assetFileName)}"`,
          escapeRegExp(path.join(packageRoot, "dist", assetFileName)),
          escapeRegExp(path.join(packageRoot, assetFileName)),
        ].join("[\\s\\S]*")
      )
    )
  })
})
