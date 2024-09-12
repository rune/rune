import type { Plugin } from "vite"
import path from "node:path"
import { existsSync } from "node:fs"
import { getTransformHtmlForBuildPlugins } from "./plugins/transformHtml.js"
import { getBuildLogicPlugin } from "./plugins/buildLogic.js"
import { getDetectExternalImportsPlugin } from "./plugins/detectExternalImports.js"
import { getDevPlugins } from "./plugins/devPlugins.js"
import { createRequire } from "node:module"
import { packageVersionCheck } from "./plugins/packageVersionCheck.js"

const require = createRequire(import.meta.url)

export interface ViteRunePluginOptions {
  logicPath: string
  ignoredDependencies?: string[]
  minifyLogic?: boolean
}

export default function runePlugin(options: ViteRunePluginOptions): Plugin[] {
  if (!options?.logicPath) {
    throw new Error("`logicPath` option is required to use the Rune plugin")
  }

  if (
    !options.logicPath.endsWith("logic.js") &&
    !options.logicPath.endsWith("logic.ts")
  ) {
    throw new Error(
      "`logicPath` must end with `logic.js` or `logic.ts`. For example: `src/logic.ts`, `src/logic.js`, `logic/logic.ts`, `logic/logic.js`"
    )
  }

  const logicPath = path.resolve(options.logicPath)
  if (!existsSync(logicPath)) {
    throw new Error(`Rune logic file "${options.logicPath}" not found`)
  }

  let runePkgPath: string
  try {
    runePkgPath = require.resolve("rune-sdk/package.json")
  } catch {
    throw new Error("Cannot locate the rune-sdk module. Did you install it?")
  }

  return [
    ...packageVersionCheck(runePkgPath),
    ...getDetectExternalImportsPlugin(options, logicPath),
    ...getDevPlugins(runePkgPath),
    ...getTransformHtmlForBuildPlugins(runePkgPath),
    ...getBuildLogicPlugin(options, logicPath),
  ]
}
