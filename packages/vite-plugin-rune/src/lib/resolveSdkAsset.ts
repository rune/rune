import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const assetDirs = ["dist", ""]

export interface SdkAsset {
  absolutePath: string
  packageSubPath: string
}

function readSdkVersion(runePkgPath: string) {
  try {
    return JSON.parse(readFileSync(runePkgPath, "utf-8")).version
  } catch {
    return "unknown"
  }
}

export function resolveSdkAsset(
  runePkgPath: string,
  assetFileName: string
): SdkAsset {
  const packageRoot = path.dirname(runePkgPath)

  for (const dir of assetDirs) {
    const absolutePath = path.join(packageRoot, dir, assetFileName)

    if (existsSync(absolutePath)) {
      return {
        absolutePath,
        packageSubPath: dir ? `${dir}/${assetFileName}` : assetFileName,
      }
    }
  }

  throw new Error(
    `Cannot find "${assetFileName}" in rune-sdk@${readSdkVersion(runePkgPath)}. ` +
      `Looked in: ${assetDirs
        .map((dir) => path.join(packageRoot, dir, assetFileName))
        .join(", ")}. Try reinstalling rune-sdk.`
  )
}
