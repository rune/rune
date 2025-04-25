import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

import { copy, emptyDir } from "./files.js"

export const templatesDirectory = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../templates"
)

export const templates = [
  { label: "JavaScript", value: "javascript" },
  { label: "JavaScript + React", value: "javascript-react" },
  { label: "TypeScript", value: "typescript" },
  { label: "TypeScript + React", value: "typescript-react" },
  { label: "TypeScript + Pixi + React", value: "typescript-pixi-react" },
  { label: "TypeScript + Svelte", value: "typescript-svelte" },
  { label: "TypeScript + Vue", value: "typescript-vue" },
]

const getPackageName = (targetDir: string) => {
  const fullTargetDirPath = path.resolve(targetDir)

  const lastDirectoryName = fullTargetDirPath.split(path.sep).pop()

  if (!lastDirectoryName) return "rune-game" // in-case they put in a root relative path

  // Replace any non-hyphen characters (like spaces or underscores) with hyphens
  return lastDirectoryName.replace(/[^a-zA-Z0-9]/g, "-")
}

export const createGameFromTemplate = async ({
  overwrite,
  targetDir,
  template,
}: {
  overwrite: boolean
  targetDir: string
  template: string
}) => {
  if (overwrite) {
    await emptyDir(targetDir)
  } else if (!fs.existsSync(targetDir)) {
    await fs.promises.mkdir(targetDir, { recursive: true })
  }

  const templateDir = path.resolve(
    path.join(templatesDirectory, "./", template)
  )

  const files = await fs.promises.readdir(templateDir)

  for (const file of files.filter((f) => f !== "package.json")) {
    await copy(path.join(templateDir, file), path.join(targetDir, file))
  }

  // fixes issue where npm removes gitignore file during publish https://github.com/npm/npm/issues/3763
  await fs.promises.rename(
    path.join(targetDir, "gitignore"),
    path.join(targetDir, ".gitignore")
  )

  const pkg = JSON.parse(
    await fs.promises.readFile(path.join(templateDir, `package.json`), "utf-8")
  )

  pkg.name = getPackageName(targetDir)

  await fs.promises.writeFile(
    path.join(targetDir, "package.json"),
    `${JSON.stringify(pkg, null, 2)}\n`
  )
}
