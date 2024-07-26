import type { Plugin } from "vite"
import path from "node:path"
import { existsSync } from "node:fs"
import { getTransformHtmlForBuildPlugins } from "./plugins/transformHtml.js"
import { getBuildLogicPlugin } from "./plugins/buildLogic.js"
import { getDetectExternalImportsPlugin } from "./plugins/detectExternalImports.js"
import { getDevPlugins } from "./plugins/devPlugins.js"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

export interface ViteDuskPluginOptions {
  logicPath: string
  ignoredDependencies?: string[]
  minifyLogic?: boolean
}

export default function duskPlugin(options: ViteDuskPluginOptions): Plugin[] {
  if (!options?.logicPath) {
    throw new Error("`logicPath` option is required to use the Dusk plugin")
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
    throw new Error(`Dusk logic file "${options.logicPath}" not found`)
  }

  let duskPkgPath: string
  try {
    duskPkgPath = require.resolve("dusk-games-sdk/package.json")
  } catch {
    throw new Error(
      "Cannot locate the dusk-games-sdk module. Did you install it?"
    )
  }

  return [
    ...getDetectExternalImportsPlugin(options, logicPath),
    ...getDevPlugins(duskPkgPath),
    ...getTransformHtmlForBuildPlugins(duskPkgPath),
    ...getBuildLogicPlugin(options, logicPath),
  ]
}
