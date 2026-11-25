import AdmZip from "adm-zip"
import fs from "fs"
import path from "path"

import { getGameFiles } from "./getGameFiles.js"
import { PROJECT_FILE_NAME } from "./projectFile.js"

function hasBuildStep(projectDir: string) {
  if (fs.readdirSync(projectDir).some((name) => /^vite\.config\./.test(name))) {
    return true
  }
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectDir, "package.json"), "utf-8")
    )
    return !!packageJson.scripts?.build
  } catch {
    return false
  }
}

export function gameFilesDir(projectDir: string) {
  if (!hasBuildStep(projectDir)) return projectDir

  const distDir = path.join(projectDir, "dist")
  if (!fs.existsSync(path.join(distDir, "index.html"))) {
    throw new Error("Run your build first (no dist/index.html).")
  }
  return distDir
}

export async function zipProject(projectDir: string) {
  const zip = new AdmZip()
  const dir = path.resolve(gameFilesDir(projectDir))

  for (const file of await getGameFiles(dir)) {
    const relativePath = path.relative(dir, file.path)
    if (
      relativePath === PROJECT_FILE_NAME ||
      relativePath.split(path.sep).includes("node_modules")
    ) {
      continue
    }

    const fileDir = path.dirname(relativePath)
    zip.addLocalFile(file.path, fileDir === "." ? "" : fileDir)
  }

  return zip.toBuffer()
}
