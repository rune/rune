import { createRequire } from "node:module"
import { createLogger, type Plugin } from "vite"

const require = createRequire(import.meta.url)

function getLatestNpmVersion(npmPackage: string) {
  return fetch(`https://registry.npmjs.org/${npmPackage}/latest`)
    .then((res) => res.json())
    .then((res) => res.version as string | undefined)
}

const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"
const installYarn = "yarn add dusk-games-sdk@"
const installNpm = "npm install --save dusk-games-sdk@"

export function packageVersionCheck(duskPkgPath: string): Plugin[] {
  let logger = createLogger()

  return [
    {
      name: "vite:dusk-plugin:package-version-check",
      enforce: "post",

      config: (config) => {
        if (config.customLogger) {
          logger = config.customLogger
        }

        getLatestNpmVersion("dusk-games-sdk")
          .then((latestVersion) => {
            if (latestVersion !== require(duskPkgPath).version) {
              logger.info(
                `\n\ndusk-games-sdk version ${latestVersion} available.`
              )
              logger.info(
                `Please install it using "${pkgManager === "npm" ? installNpm : installYarn}${latestVersion}"\n\n`
              )
            }
          })
          .catch(() =>
            logger.info("Failed to check latest dusk-games-sdk version")
          )
      },
    },
  ]
}
