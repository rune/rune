export default function transformJSON(json: any) {
  ;["dependencies", "devDependencies", "peerDependencies"].forEach((dep) => {
    if (json[dep]) {
      if (json[dep]["dusk-games-sdk"]) {
        delete json[dep]["dusk-games-sdk"]
        json[dep]["rune-sdk"] = "^5.0.0"
      }
    }
  })

  json["scripts"]["upload"] = "npm run build && npx rune@latest upload"

  return json
}
