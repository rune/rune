import type { FileInfo, API } from "jscodeshift"

export default function transform(
  file: FileInfo,
  api: API
): string | undefined {
  const j = api.jscodeshift

  const root = j(file.source)

  root.find(j.ImportDeclaration).forEach((path) => {
    // Find the import specifier for 'RuneClient'

    path.node.specifiers?.forEach((specifier) => {
      if ("imported" in specifier && specifier.imported.name === "RuneClient") {
        specifier.imported.name = "DuskClient"

        j(path).replaceWith(path.node)
      }
    })
  })

  root
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        path.node.source.value === "rune-games-sdk" ||
        path.node.source.value === "rune-games-sdk/multiplayer"
    )
    .forEach((path) => {
      path.node.source.value = "dusk-games-sdk"

      j(path).replaceWith(path.node)
    })

  root.find(j.Identifier, { name: "RuneClient" }).forEach((path) => {
    path.node.name = "DuskClient"

    j(path).replaceWith(path.node)
  })

  root.find(j.Identifier, { name: "Rune" }).forEach((path) => {
    path.node.name = "Dusk"

    j(path).replaceWith(path.node)
  })

  return root.toSource()
}
