import type { Plugin } from "vite"
import { init, parse as parseImports } from "es-module-lexer"
import path from "node:path"
import TreeModel from "tree-model"
import { debounce } from "../lib/debounce.js"
import { ViteRunePluginOptions } from "../index.js"

type Model = {
  name: string
}

function withoutExtension(str: string) {
  return str.replace(/\.\w+$/, "")
}

export function getDetectExternalImportsPlugin(
  _options: ViteRunePluginOptions,
  logicPath: string
): Plugin[] {
  const treeNodesByFile: Record<string, TreeModel.Node<Model>> = {}

  const tree = new TreeModel()
  const root = tree.parse<{ name: string }>({
    name: withoutExtension(logicPath),
    children: [],
  })

  const printTree = debounce(() => {
    const externalDeps: { name: string; importedBy: string }[] = []

    root.walk((node) => {
      const name = (node.model as Model).name

      if (!name.startsWith("/")) {
        externalDeps.push({
          name,
          importedBy: node.parent.model.name,
        })
      }
      return true
    })

    const list = externalDeps
      .map((dep) => `${dep.name}, imported by: ${dep.importedBy}`)
      .join("\n")

    console.log(`External dependencies:\n${list}`)
  })

  return [
    {
      name: "vite:rune-plugin:detect-external-imports",
      enforce: "pre",

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

          const nodeInTree = root.first((node) => node.model.name === id)

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
                  treeNodesByFile[fullPath] || tree.parse({ name: fullPath })

                treeNodesByFile[fullPath] = node

                nodeInTree.addChild(node)
              }
            })
          }

          printTree()
        } catch (e) {
          //Do nothing for now
        }
      },
    },
  ]
}
