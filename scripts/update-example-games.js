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
    gameName: dirent.name,
    gameDir: path.join(examplesDir, dirent.name),
    shouldInstall: true,
  }))

const templateGames = fs
  .readdirSync(templatesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => ({
    gameName: dirent.name,
    gameDir: path.join(templatesDir, dirent.name),
    shouldInstall: false,
  }))

const duskTemplateGames = fs
  .readdirSync(duskTemplatesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => ({
    gameName: dirent.name,
    gameDir: path.join(duskTemplatesDir, dirent.name),
    shouldInstall: false,
    isDusk: true,
  }))

const promises = []
const games = [...exampleGames, ...templateGames, ...duskTemplateGames]

games.forEach(({ gameName, gameDir, shouldInstall, isDusk }) => {
  const packageJsonPath = path.join(gameDir, "package.json")

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath)

    packageJson.dependencies[
      isDusk ? "dusk-games-sdk" : "rune-games-sdk"
    ] = `^${version}`

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    if (shouldInstall) {
      promises.push(
        // eslint-disable-next-line no-undef
        new Promise((resolve, reject) => {
          console.log(`Updating ${gameName}`)
          const child = child_process.spawn("yarn", { cwd: gameDir })
          child.on("exit", function (code) {
            if (code === 0) {
              console.log(`Updated ${gameName}`)
              resolve()
            } else {
              reject()
            }
          })
        })
      )
    }
  }

  if (gamesWithHtml[gameName]) {
    const indexHtmlPath = path.join(gameDir, gamesWithHtml[gameName])

    const indexHtml = fs.readFileSync(indexHtmlPath).toString()

    fs.writeFileSync(
      indexHtmlPath,
      indexHtml.replace(
        /<script src="https:\/\/cdn.jsdelivr.net\/npm\/rune-games-sdk@.+\/multiplayer-dev.js">/,
        `<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@${version}/multiplayer-dev.js">`
      )
    )
  }
})

// eslint-disable-next-line no-undef
Promise.all(promises)
  .then(() => {
    console.log("Example games updated successfully")
  })
  .catch((err) => {
    console.error(
      "Something went wrong. Most likely SDK version is not correct",
      err
    )
  })
