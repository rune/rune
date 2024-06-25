export default function transformJSON(json: any) {
  ;["dependencies", "devDependencies", "peerDependencies"].forEach((dep) => {
    if (json[dep]) {
      if (json[dep]["rune-games-sdk"]) {
        delete json[dep]["rune-games-sdk"]
        json[dep]["dusk-games-sdk"] = "^4.19.17"
      }

      if (json[dep]["eslint-plugin-rune"]) {
        delete json[dep]["eslint-plugin-rune"]
        json[dep]["eslint-plugin-dusk"] = "^1.0.1"
      }

      if (json[dep]["vite-plugin-rune"]) {
        delete json[dep]["vite-plugin-rune"]
        json[dep]["vite-plugin-dusk"] = "^1.0.0"
      }

      json[dep] = Object.keys(json[dep])
        .sort()
        .reduce((obj, key) => {
          obj[key] = json[dep][key]
          return obj
        }, {} as any)
    }
  })

  if (json["scripts"]) {
    Object.keys(json["scripts"]).forEach((key) => {
      json["scripts"][key] = json["scripts"][key].replace(
        "rune-games-cli",
        "dusk-cli"
      )
    })
  }

  return json
}
