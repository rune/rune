import type { Plugin } from "vite"
import { createRequire } from "node:module"
import path from "node:path"
import { existsSync, readFileSync } from "node:fs"

const require = createRequire(import.meta.url)

export interface ViteRunePluginOptions {
  logicPath: string
}

const runtimePublicPath = "/@rune-games-sdk"

export default function runePlugin(options: ViteRunePluginOptions): Plugin[] {
  let runePkgPath: string
  try {
    runePkgPath = require.resolve("rune-games-sdk/package.json")
  } catch (e) {
    throw new Error(
      "Cannot locate the rune-games-sdk module. Did you install it?"
    )
  }

  const runeVersion = JSON.parse(readFileSync(runePkgPath, "utf-8")).version

  if (!options?.logicPath) {
    throw new Error("`logicPath` option is required to use the Rune plugin")
  }
  const logicPath = path.resolve(options.logicPath)
  if (!existsSync(logicPath)) {
    throw new Error(`Rune logic file "${options.logicPath}" not found`)
  }

  return [
    {
      name: "vite:rune-plugin:resolve-runtime",
      apply: "serve",
      enforce: "pre", // Run before Vite default resolve to avoid syscalls
      resolveId: (id) => (id === runtimePublicPath ? id : undefined),
      load: (id) =>
        id === runtimePublicPath
          ? readFileSync(
              path.resolve(runePkgPath, "../multiplayer-dev.js"),
              "utf-8"
            )
          : undefined,
    },
    {
      name: "vite:rune-plugin:inject-runtime",
      enforce: "post",
      // Inject the multiplayer script first of all.
      // If we don't then live reload scripts will be injected before and
      // cause the dev UI to also reload when only the iframes should.
      transformIndexHtml(html, { server }) {
        return {
          html,
          tags: [
            {
              tag: "script",
              attrs: {
                src: server
                  ? runtimePublicPath
                  : `https://cdn.jsdelivr.net/npm/rune-games-sdk@${runeVersion}/multiplayer.js`,
              },
              injectTo: "head-prepend",
            },
          ],
        }
      },
    },
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

          //Try to unify pats so that no matter what platform they run on they would use /.
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
  ]
}
