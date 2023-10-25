const fs = require("fs")
const path = require("path")
const child_process = require("child_process")

const version = process.argv[2]

const examplesDir = path.resolve(__dirname, "../examples")

if (version === undefined) {
  console.log("Please provide SDK version")
  process.exit(1)
}

const exampleGames = fs
  .readdirSync(examplesDir, {
    withFileTypes: true,
  })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

const promises = []

exampleGames.forEach((exampleGame) => {
  const packageJsonPath = path.join(examplesDir, exampleGame, "package.json")

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath)

    packageJson.dependencies["rune-games-sdk"] = `^${version}`

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    promises.push(
      // eslint-disable-next-line no-undef
      new Promise((resolve, reject) => {
        console.log(`Updating ${exampleGame}`)
        const child = child_process.spawn("yarn", {
          cwd: path.join(examplesDir, exampleGame),
        })
        child.on("exit", function (code) {
          if (code === 0) {
            console.log(`Updated ${exampleGame}`)
            resolve()
          } else {
            reject()
          }
        })
      })
    )
  } else {
    const indexHtmlPath = path.join(examplesDir, exampleGame, "index.html")

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
  .catch(() => {
    console.error(
      "Something went wrong. Most likely SDK version is not correct"
    )
  })
