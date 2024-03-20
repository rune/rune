import type { Plugin } from "vite"
import { createLogger } from "vite"
import { init, parse as parseImports } from "es-module-lexer"
import path from "node:path"
import TreeModel from "tree-model"
import { debounce } from "../lib/debounce.js"
import { ViteRunePluginOptions } from "../index.js"

type Model = {
  fileName: string
}

function withoutExtension(str: string) {
  return str.replace(/\.\w+$/, "")
}

export function getDetectExternalImportsPlugin(
  _options: ViteRunePluginOptions,
  logicPath: string
): Plugin[] {
  const treeNodesByFile: Record<string, TreeModel.Node<Model>> = {}

  let logger = createLogger()
  let command: "build" | "serve"

  const logicImportTree = new TreeModel()
  const logicFileLeaf = logicImportTree.parse<{ fileName: string }>({
    fileName: withoutExtension(logicPath),
    children: [],
  })

  function getExternalDeps() {
    const externalDeps: { fileName: string; importedBy: string }[] = []

    logicFileLeaf.walk((node) => {
      const name = (node.model as Model).fileName

      if (!name.startsWith("/")) {
        externalDeps.push({
          fileName: name,
          importedBy: node.parent.model.fileName,
        })
      }
      return true
    })

    return externalDeps
  }

  const listExternalDeps = () => {
    const list = getExternalDeps()
      .map((dep) => `${dep.fileName}, imported by: ${dep.importedBy}`)
      .join("\n")

    logger.warn(`External dependencies:\n${list}`)
  }

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

      banner: (chunk) => {
        if (chunk.fileName !== "logic.js") {
          return ""
        }

        const externalDeps = getExternalDeps()

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
          await init

          const id = withoutExtension(idWithExtension)

          const importerDirectory = id
            .split(path.sep)
            .slice(0, -1)
            .join(path.sep)

          // Taken from https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importAnalysis.ts
          const [imports] = parseImports(code)

          const nodeInTree = logicFileLeaf.first(
            (node) => node.model.fileName === id
          )

          if (nodeInTree) {
            nodeInTree.children = []

            imports.forEach((imp) => {
              if (imp.n) {
                const fullImport = code.slice(imp.ss, imp.se)

                //Ignore type imports
                if (fullImport.includes("import type")) {
                  return
                }

                let fullPath = imp.n
                if (imp.n.startsWith(`./`)) {
                  fullPath = path.join(importerDirectory, imp.n)
                }

                const node =
                  treeNodesByFile[fullPath] ||
                  logicImportTree.parse({ fileName: fullPath })

                treeNodesByFile[fullPath] = node

                nodeInTree.addChild(node)
              }
            })
          }

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
