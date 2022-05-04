import fs from "fs"
import semver from "semver"

const packageJson = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
)

const dependencies = Object.assign(
  {},
  packageJson.dependencies,
  packageJson.devDependencies
)

const invalidVersions = Object.keys(dependencies).reduce((acc, dependency) => {
  const version = dependencies[dependency]

  if (
    !isNaN(+version[version.length - 1]) &&
    version !== semver.valid(semver.coerce(version))
  ) {
    acc[dependency] = version
  }

  return acc
}, {})

if (Object.keys(invalidVersions).length) {
  console.error(
    [
      "Some of the dependency versions in package.json are not pinned:",
      JSON.stringify(invalidVersions, null, 2),
    ].join("\n")
  )
  process.exit(-1)
}
