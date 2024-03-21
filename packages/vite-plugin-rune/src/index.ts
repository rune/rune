import type { Plugin } from "vite"
import path from "node:path"
import { existsSync } from "node:fs"
import { getInjectSdkPlugins } from "./plugins /injectSDK.js"
import { getBuildLogicPlugin } from "./plugins /buildLogic.js"
import { getDetectExternalImportsPlugin } from "./plugins /detectExternalImports.js"

export interface ViteRunePluginOptions {
  logicPath: string
  ignoredDependencies?: string[]
  minifyLogic?: boolean
}

export default function runePlugin(options: ViteRunePluginOptions): Plugin[] {
  if (!options?.logicPath) {
    throw new Error("`logicPath` option is required to use the Rune plugin")
  }
  const logicPath = path.resolve(options.logicPath)
  if (!existsSync(logicPath)) {
    throw new Error(`Rune logic file "${options.logicPath}" not found`)
  }

  return [
    ...getDetectExternalImportsPlugin(options, logicPath),
    ...getInjectSdkPlugins(),
    ...getBuildLogicPlugin(options, logicPath),
  ]
}
