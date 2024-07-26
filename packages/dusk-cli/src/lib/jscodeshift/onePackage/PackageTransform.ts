export default function transformJSON(
  json: any,
  type: "javascript" | "typescript" | "javascript-react" | "typescript-react"
) {
  ;["dependencies", "devDependencies", "peerDependencies"].forEach((dep) => {
    if (json[dep]) {
      if (json[dep]["dusk-games-sdk"]) {
        json[dep]["dusk-games-sdk"] = "^4.21.1"
      }

      ;[
        "vite-plugin-dusk",
        "eslint-plugin-dusk",
        "eslint",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
      ].forEach((key) => {
        if (json[dep][key]) {
          delete json[dep][key]
        }
      })
    }
  })

  if (json["scripts"]?.["lint"]) {
    json["scripts"]["lint"] = "eslint src"
  }

  json["devDependencies"]["eslint"] = "^9.7.0"
  json["devDependencies"]["@eslint/js"] = "^9.7.0"
  json["devDependencies"]["eslint-config-prettier"] = "^9.1.0"
  json["devDependencies"]["eslint-plugin-prettier"] = "^5.2.1"
  json["devDependencies"]["prettier"] = "^3.3.3"
  json["devDependencies"]["globals"] = "^15.8.0"

  if (type === "typescript" || type === "typescript-react") {
    json["devDependencies"]["typescript-eslint"] = "^8.0.0-alpha.54"
  }

  if (type === "javascript-react" || type === "typescript-react") {
    json["devDependencies"]["@eslint/compat"] = "^1.1.1"
    json["devDependencies"]["eslint-plugin-react"] = "^7.35.0"
    json["devDependencies"]["eslint-plugin-react-hooks"] = "beta"
  }

  ;["dependencies", "devDependencies", "peerDependencies"].forEach((dep) => {
    if (json[dep]) {
      json[dep] = Object.keys(json[dep])
        .sort()
        .reduce((obj, key) => {
          obj[key] = json[dep][key]

          return obj
        }, {} as any)
    }
  })

  return json
}
