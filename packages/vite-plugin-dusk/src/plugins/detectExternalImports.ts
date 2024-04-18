import type { Plugin } from "vite"
import { createLogger, normalizePath } from "vite"
import { init, parse as parseImports } from "es-module-lexer"
import path from "node:path"
import TreeModel from "tree-model"
import { debounce } from "../lib/debounce.js"
import { ViteDuskPluginOptions } from "../index.js"
import { DEPENDENCY_WHITELIST } from "../dependency-whitelist.js"
import { normalizeId } from "../lib/normalizeId.js"

type Model = {
  fileName: string
}

function withoutExtension(str: string) {
  return str.replace(/\.\w+$/, "")
}

export function getDetectExternalImportsPlugin(
  options: ViteDuskPluginOptions,
  logicPath: string
): Plugin[] {
  let logger = createLogger()
  let command: "build" | "serve"

  //Playing around with vite logger to try to make the warning message appear as consistent as possible
  let previousError: Error

  //Storing a reference to every file that was ever imported by logic.js
  //This is necessary because during vite serve, removing an import to the file and then adding it again will not trigger transform for that file.
  const treeNodesByFile: Record<string, TreeModel.Node<Model>> = {}

  //Storing a tree of imports starting from logic.js file.
  const logicImportTree = new TreeModel()

  const normalizedLogicPath = normalizePath(withoutExtension(logicPath))

  const logicFileNode = logicImportTree.parse<{ fileName: string }>({
    fileName: normalizedLogicPath,
    children: [],
  })

  //Also save the logic file in cache, since we always access the data from the cache.
  treeNodesByFile[normalizedLogicPath] = logicFileNode

  function getExternalDeps(skipAllowedDependencies: boolean) {
    const externalDeps: { fileName: string; importedBy: string }[] = []

    logicFileNode.walk((node) => {
      const name = (node.model as Model).fileName

      //Not external, ignore it
      if (path.isAbsolute(name)) {
        return true
      }

      const isInWhitelist =
        DEPENDENCY_WHITELIST.includes(name) ||
        options.ignoredDependencies?.includes(name)

      if (skipAllowedDependencies && isInWhitelist) {
        return true
      }

      externalDeps.push({
        fileName: name,
        importedBy: node.parent.model.fileName,
      })

      return true
    })

    return externalDeps
  }

  const listExternalDeps = () => {
    const externalDeps = getExternalDeps(true)

    if (externalDeps.length > 0) {
      const list = externalDeps
        .map((dep) => `${dep.fileName}, imported by: ${dep.importedBy}`)
        .join("\n")

      const message = `\nWarning, external dependencies detected:\n\n${list}

These dependencies might contain code that is not supported by Dusk game logic (https://developers.dusk.gg/docs/advanced/server-side-logic).
You can disable this message by adding the dependency to ignoredDependencies array in Dusk plugin options.

You can also make a pull request to add the dependency to the whitelist at (https://github.com/rune/rune-multiplayer-web-games/blob/staging/packages/vite-plugin-dusk/src/dependency-whitelist.ts)
`
      let error = previousError
      if (previousError?.message !== message) {
        error = new Error()
        error.message = message
      }

      if (!logger.hasErrorLogged(error)) {
        logger.error(message)
        previousError = error
      }
    }
  }

  //I didn't find a way to run this only once in serve mode (didn't see anything that gets called by vite after all files are done), so I'm using debounce to run it only once after all transforms are done.
  const onTransformDone = debounce(listExternalDeps)

  return [
    {
      name: "vite:dusk-plugin:detect-external-imports",
      enforce: "pre",

      config: (config, configEnv) => {
        command = configEnv.command
        if (config.customLogger) {
          logger = config.customLogger
        }
      },

      //List all external dependencies in generated logic.js file as a top level comment.
      banner: (chunk) => {
        if (chunk.fileName !== "logic.js") {
          return ""
        }

        const externalDeps = getExternalDeps(false)

        if (externalDeps.length > 0) {
          //Using ! at the start of comment prevents it from being removed during bundling
          return `/*! Imported dependencies: ${externalDeps
            .map((dep) => dep.fileName)
            .join(", ")}*/`
        }

        return ""
      },
      closeBundle: () => {
        listExternalDeps()
      },
      transform: async (code, idWithExtension) => {
        try {
          const id = normalizeId(withoutExtension(idWithExtension))

          const importerDirectory = id.split("/").slice(0, -1).join("/")

          // Taken from https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importAnalysis.ts
          await init
          const [imports] = parseImports(code)

          const transformedFileNode =
            treeNodesByFile[id] || logicImportTree.parse({ fileName: id })

          //Remove it's children, because we are going to re-add them.
          //This will make sure to remove any files that are not imported anymore.
          transformedFileNode.children = []

          //Process even the files that are not part of the game logic.
          //This is necessary to handle a scenario where a file is imported both by logic and by non logic file.
          //There is a chance that the file would be processed before logic file, so this way we'll already have info about it.
          imports.forEach((imp) => {
            let filePath = imp.n ? withoutExtension(imp.n) : undefined
            //.n is the name of file/package from where things are imported
            if (filePath) {
              //this returns a full line used for import. We need to use it to check if it's a type import.
              const importLine = code.slice(imp.ss, imp.se)

              //Ignore type imports
              if (importLine.includes("import type")) {
                return
              }

              //In case the import is relative, use full import, because transform is called with full path.
              if (filePath.startsWith(`./`) || filePath.startsWith(`../`)) {
                filePath = path.join(importerDirectory, filePath)
              }

              filePath = normalizePath(filePath)

              const node =
                treeNodesByFile[filePath] ||
                logicImportTree.parse({ fileName: filePath })

              treeNodesByFile[filePath] = node

              transformedFileNode.addChild(node)
            }
          })

          if (command === "serve") {
            onTransformDone()
          }
        } catch (e) {
          //Do nothing for now
        }
      },
    },
  ]
}
