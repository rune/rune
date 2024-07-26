import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

function getLatestNpmVersion(npmPackage: string) {
  return fetch(`https://registry.npmjs.org/${npmPackage}/latest`)
    .then((res) => res.json())
    .then((res) => res.version as string | undefined)
}

const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"
const installYarn = "yarn add dusk-games-sdk@"
const installNpm = "npm install --save dusk-games-sdk@"

export function packageVersionCheck(duskPkgPath: string) {
  getLatestNpmVersion("dusk-games-sdk")
    .then((latestVersion) => {
      if (latestVersion !== require(duskPkgPath).version) {
        console.log(`dusk-games-sdk version ${latestVersion} available.`)
        console.log(
          `Please install it using "${pkgManager === "npm" ? installNpm : installYarn}${latestVersion}"`
        )
      }
    })
    .catch(() => console.log("Failed to check latest dusk-games-sdk version"))
}
