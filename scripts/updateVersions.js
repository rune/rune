const fs = require("fs")

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
const version = packageJson.version
const minorVersion = version.split(".").slice(0, 2).join(".")

replaceInFile(
  "README.md",
  /"https:\/\/cdn\.jsdelivr\.net.+"/,
  `"https://cdn.jsdelivr.net/npm/rune-games-sdk@${minorVersion}/dist/browser.min.js"`
)

replaceInFile(
  "src/index.ts",
  /version: "\d+\.\d+\.\d+"/,
  `version: "${version}"`
)

replaceInFile(
  "examples/bunny-twirl/index.html",
  /"https:\/\/cdn\.jsdelivr\.net.+"/,
  `"https://cdn.jsdelivr.net/npm/rune-games-sdk@${minorVersion}/dist/browser.min.js"`
)

replaceInFile(
  "examples/breakout/index.html",
  /"https:\/\/cdn\.jsdelivr\.net.+"/,
  `"https://cdn.jsdelivr.net/npm/rune-games-sdk@${minorVersion}/dist/browser.min.js"`
)

function replaceInFile(path, regex, replacement) {
  fs.writeFileSync(
    path,
    fs.readFileSync(path, "utf8").replace(regex, replacement)
  )
}
