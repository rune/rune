const fs = require("fs")
const path = require("path")
const child_process = require("child_process")

const version = process.argv[2]

const examplesDir = path.resolve(__dirname, "../examples")
const templatesDir = path.resolve(
  __dirname,
  "../packages/rune-games-cli/templates"
)
const duskTemplatesDir = path.resolve(
  __dirname,
  "../packages/dusk-cli/templates"
)

const duskCliDir = path.resolve(__dirname, "../packages/dusk-cli")
const runeCliDir = path.resolve(__dirname, "../packages/rune-games-cli")

//These example games also have sdk version inside html
const gamesWithHtml = {
  "oink-oink": "public/index.html",
  pinpoint: "public/index.html",
  sudoku: "public/index.html",
  "tic-tac-toe": "index.html",
}

if (version === undefined) {
  console.log("Please provide SDK version")
  process.exit(1)
}

const exampleGames = fs
  .readdirSync(examplesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => ({
    name: dirent.name,
    dir: path.join(examplesDir, dirent.name),
    shouldInstall: true,
  }))

const templateGames = fs
  .readdirSync(templatesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => ({
    name: dirent.name,
    dir: path.join(templatesDir, dirent.name),
    shouldInstall: false,
  }))

const duskTemplateGames = fs
  .readdirSync(duskTemplatesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => ({
    name: dirent.name,
    dir: path.join(duskTemplatesDir, dirent.name),
    shouldInstall: false,
    isDusk: true,
  }))

const duskCli = {
  name: "dusk-cli",
  dir: duskCliDir,
  shouldInstall: false,
  isDusk: true,
}

const locations = [
  ...exampleGames,
  ...templateGames,
  ...duskTemplateGames,
  duskCli,
]

locations.forEach(({ name, dir, shouldInstall, isDusk }) => {
  const packageJsonPath = path.join(dir, "package.json")

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath)

    packageJson.dependencies[
      isDusk ? "dusk-games-sdk" : "rune-games-sdk"
    ] = `^${version}`

    console.log(`Updating ${path.relative(path.join(__dirname, ".."), dir)}`)

    console.log(` - Updating package.json`)
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    if (shouldInstall) {
      console.log(` - Updating yarn.lock (running yarn)`)
      child_process.execSync("yarn", { cwd: dir, stdio: "ignore" })
    }
  }

  if (gamesWithHtml[name]) {
    const indexHtmlPath = path.join(dir, gamesWithHtml[name])

    const indexHtml = fs.readFileSync(indexHtmlPath).toString()

    console.log(` - Updating index.html`)
    fs.writeFileSync(
      indexHtmlPath,
      indexHtml.replace(
        /<script src="https:\/\/cdn.jsdelivr.net\/npm\/rune-games-sdk@.+\/multiplayer-dev.js">/,
        `<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@${version}/multiplayer-dev.js">`
      )
    )
  }
})

console.log("Sdk version updated successfully")
