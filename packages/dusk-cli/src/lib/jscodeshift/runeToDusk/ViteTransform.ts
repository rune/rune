import type { FileInfo, API } from "jscodeshift"

export default function transform(
  file: FileInfo,
  api: API
): string | undefined {
  const j = api.jscodeshift

  const root = j(file.source)

  root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === "vite-plugin-rune")
    .forEach((path) => {
      path.node.source.value = "vite-plugin-dusk"

      j(path).replaceWith(path.node)
    })

  root.find(j.Identifier, { name: "rune" }).forEach((path) => {
    path.node.name = "dusk"

    j(path).replaceWith(path.node)
  })

  return root.toSource()
}
