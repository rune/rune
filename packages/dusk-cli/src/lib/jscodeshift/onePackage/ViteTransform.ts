import type { FileInfo, API } from "jscodeshift"

export default function transform(
  file: FileInfo,
  api: API
): string | undefined {
  const j = api.jscodeshift

  const root = j(file.source)

  root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === "vite-plugin-dusk")
    .forEach((path) => {
      path.node.source.value = "dusk-games-sdk/vite"

      j(path).replaceWith(path.node)
    })
  return root.toSource()
}
