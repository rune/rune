import type { Plugin } from "vite"
import path from "node:path"
import { terserPlugin } from "./terser.js"
import { ViteRunePluginOptions } from "../index.js"

export function getBuildLogicPlugin(
  options: ViteRunePluginOptions,
  logicPath: string
): Plugin[] {
  return [
    {
      name: "vite:rune-plugin:build",
      apply: "build",
      outputOptions: (options) => ({
        ...options,
        generatedCode: "es5",
        // Force logic.js chunk to be named so.
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === "logic") {
            return "logic.js"
          }
          return typeof options.chunkFileNames === "function"
            ? options.chunkFileNames(chunkInfo)
            : options.chunkFileNames!
        },
        // Force all logic related code into a logic.js chunk.
        manualChunks: (id, { getModuleInfo }) => {
          const moduleInfo = getModuleInfo(id)

          //For some reason on windows some paths are returned with \x00 at the beginning. Remove it.
          const idWithoutNull = id.startsWith("\x00") ? id.slice(1) : id

          //TODO - refactor it to use normalizePath from vite
          //Try to unify paths so that no matter what platform they run on they would use /.
          //This is necessary due to vite not providing platform specific paths in some cases
          const platformAgnosticId = idWithoutNull.split(path.sep).join("/")
          const platformAgnosticLogicPath = logicPath.split(path.sep).join("/")
          const platformAgnosticImporters = moduleInfo
            ? moduleInfo.importers.map((importer: string) =>
                importer.split(path.sep).join("/")
              )
            : []

          if (
            platformAgnosticId === platformAgnosticLogicPath ||
            platformAgnosticImporters.includes(platformAgnosticLogicPath)
          ) {
            return "logic"
          }
        },
      }),
    },
    terserPlugin(options.minifyLogic ?? false),
  ]
}
