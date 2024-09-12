import { createRequire } from "node:module"
import { createLogger, type Plugin } from "vite"

const require = createRequire(import.meta.url)

function getLatestNpmVersion(npmPackage: string) {
  return fetch(`https://registry.npmjs.org/${npmPackage}/latest`)
    .then((res) => res.json())
    .then((res) => res.version as string | undefined)
}

const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"
const installYarn = "yarn add rune-sdk@"
const installNpm = "npm install --save rune-sdk@"

export function packageVersionCheck(runePkgPath: string): Plugin[] {
  let logger = createLogger()

  return [
    {
      name: "vite:rune-plugin:package-version-check",
      enforce: "post",

      config: (config) => {
        if (config.customLogger) {
          logger = config.customLogger
        }

        getLatestNpmVersion("rune-sdk")
          .then((latestVersion) => {
            if (latestVersion !== require(runePkgPath).version) {
              logger.info(`\n\nrune-sdk version ${latestVersion} available.`)
              logger.info(
                `Please install it using "${pkgManager === "npm" ? installNpm : installYarn}${latestVersion}"\n\n`
              )
            }
          })
          .catch(() => logger.info("Failed to check latest rune-sdk version"))
      },
    },
  ]
}
