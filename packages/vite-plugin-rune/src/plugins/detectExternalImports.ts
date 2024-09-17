import type { Plugin } from "vite"
import { createLogger, normalizePath } from "vite"
import { init, parse as parseImports } from "es-module-lexer"
import path from "node:path"
import TreeModel from "tree-model"
import { debounce } from "../lib/debounce.js"
import { ViteRunePluginOptions } from "../index.js"
import { DEPENDENCY_WHITELIST } from "../dependency-whitelist.js"
import { normalizeId } from "../lib/normalizeId.js"

type Model = {
  fileName: string
  withOptionalExtension: string
}

function withoutExtension(str: string) {
  return str.replace(/\.\w+$/, "")
}

//Files that are treated as assets by vite, which leads to them being not included in the logic chunk.
//https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts
export const KNOWN_ASSET_TYPES = [
  // images
  "apng",
  "bmp",
  "png",
  "jpe?g",
  "jfif",
  "pjpeg",
  "pjp",
  "gif",
  "svg",
  "ico",
  "webp",
  "avif",

  // media
  "mp4",
  "webm",
  "ogg",
  "mp3",
  "wav",
  "flac",
  "aac",
  "opus",
  "mov",
  "m4a",
  "vtt",

  // fonts
  "woff2?",
  "eot",
  "ttf",
  "otf",

  // other
  "webmanifest",
  "pdf",
  "txt",
]

export function getDetectExternalImportsPlugin(
  options: ViteRunePluginOptions,
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

  const logicFileNode = logicImportTree.parse<Model>({
    fileName: normalizedLogicPath,
    withOptionalExtension: logicPath,
    children: [],
  })

  //Also save the logic file in cache, since we always access the data from the cache.
  treeNodesByFile[normalizedLogicPath] = logicFileNode

  function getExternalDeps(skipAllowedDependencies: boolean) {
    const externalDeps: { fileName: string; importedBy: string }[] = []

    const nodes: TreeModel.Node<any>[] = []

    //Collect all nodes taking into consideration possible circular dependencies
    function collectAll(node: TreeModel.Node<any>) {
      const childCount = node.children.length
      for (let i = 0; i < childCount; i++) {
        if (nodes.includes(node.children[i])) {
          continue
        }
        nodes.push(node.children[i])

        collectAll(node.children[i])
      }
    }

    collectAll(logicFileNode)

    nodes.forEach((node) => {
      const { fileName: name, withOptionalExtension } = node.model as Model

      const extension = withOptionalExtension.split(".").at(-1)

      if (extension && KNOWN_ASSET_TYPES.includes(extension)) {
        const importPath = []

        let tmpNode = node.parent

        while (tmpNode) {
          importPath.push(tmpNode.model.withOptionalExtension)

          tmpNode = tmpNode.parent
        }

        logger.clearScreen("info")
        logger.error(
          `\t\x1b[31m\nAssets are not allowed in Rune logic file.
File: ${withOptionalExtension} was imported by:\n${importPath.join("\n")}
          \x1b[0m`
        )

        //Do not allow to build logic file if assets are imported
        if (command === "build") {
          process.exit(1)
        }
      }

      //Not external, ignore it
      if (path.isAbsolute(name)) {
        return
      }

      const ignoredDependencies = [
        ...DEPENDENCY_WHITELIST,
        ...(options.ignoredDependencies || []),
      ]

      const isInWhitelist = ignoredDependencies.some(
        (ignoredDependency) =>
          name === ignoredDependency || name.startsWith(ignoredDependency + "/")
      )

      if (skipAllowedDependencies && isInWhitelist) {
        return
      }

      externalDeps.push({
        fileName: name,
        importedBy: node.parent.model.fileName,
      })

      return
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

These dependencies might contain code that is not supported by Rune game logic (https://developers.rune.ai/docs/advanced/server-side-logic).
You can disable this message by adding the dependency to ignoredDependencies array in Rune plugin options.
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
      name: "vite:rune-plugin:detect-external-imports",
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
      transform: async (code, idWithOptionalExtension) => {
        try {
          const id = normalizeId(withoutExtension(idWithOptionalExtension))

          const importerDirectory = id.split("/").slice(0, -1).join("/")

          // Taken from https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importAnalysis.ts
          await init
          const [imports] = parseImports(code)

          const transformedFileNode =
            treeNodesByFile[id] ||
            logicImportTree.parse({
              fileName: id,
              withOptionalExtension: idWithOptionalExtension,
            })

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
                logicImportTree.parse({
                  fileName: filePath,
                  withOptionalExtension: imp.n,
                })

              treeNodesByFile[filePath] = node

              transformedFileNode.addChild(node)
            }
          })

          if (command === "serve") {
            onTransformDone()
          }
        } catch {
          //Do nothing for now
        }
      },
    },
  ]
}
