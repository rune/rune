const fs = require("fs")

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
const version = packageJson.version

replaceInFile(
  "README.md",
  /"https:\/\/cdn\.jsdelivr\.net.+"/,
  `"https://cdn.jsdelivr.net/npm/rune-games-sdk@${version}/dist/browser.min.js"`
)

replaceInFile(
  "godot/README.md",
  /"https:\/\/cdn\.jsdelivr\.net.+"/,
  `"https://cdn.jsdelivr.net/npm/rune-games-sdk@${version}/dist/browser.min.js"`
)

replaceInFile(
  "src/index.ts",
  /version: "\d+\.\d+\.\d+"/,
  `version: "${version}"`
)

replaceInFile(
  "../../examples/singleplayer/bunny-twirl/index.html",
  /"https:\/\/cdn\.jsdelivr\.net.+"/,
  `"https://cdn.jsdelivr.net/npm/rune-games-sdk@${version}/dist/browser.min.js"`
)

replaceInFile(
  "../../examples/singleplayer/breakout/index.html",
  /"https:\/\/cdn\.jsdelivr\.net.+"/,
  `"https://cdn.jsdelivr.net/npm/rune-games-sdk@${version}/dist/browser.min.js"`
)

function replaceInFile(path, regex, replacement) {
  fs.writeFileSync(
    path,
    fs.readFileSync(path, "utf8").replace(regex, replacement)
  )
}
