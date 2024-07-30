import type { FileInfo, API } from "jscodeshift"

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift

  const root = j(file.source)

  // Find all string literals that contain 'rune' and replace them with 'dusk'

  root
    .find(j.Literal, {
      value: (v) => typeof v === "string" && v.includes("rune"),
    })
    .forEach((path) => {
      path.node.value = (path.node.value as string).replace("rune", "dusk")

      j(path).replaceWith(path.node)
    })

  return root.toSource()
}
