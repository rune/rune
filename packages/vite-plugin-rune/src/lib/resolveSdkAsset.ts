import { existsSync } from "node:fs"
import path from "node:path"

const assetDirs = ["dist", ""]

export function resolveSdkAsset(
  runePkgPath: string,
  assetFileName: string
): {
  absolutePath: string
  packageSubPath: string
} {
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
    `Cannot find "${assetFileName}". Looked in: ${assetDirs
      .map((dir) => path.join(packageRoot, dir, assetFileName))
      .join(", ")}. Try reinstalling rune-sdk.`
  )
}
