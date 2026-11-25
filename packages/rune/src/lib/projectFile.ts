import fs from "fs"
import path from "path"

export const PROJECT_FILE_NAME = "rune.json"

export interface ProjectFile {
  gameKey: string
  base: string | null
}

function readProjectJson(dir: string): Record<string, unknown> | null {
  const filePath = path.join(dir, PROJECT_FILE_NAME)
  if (!fs.existsSync(filePath)) return null

  let json: unknown
  try {
    json = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch {
    throw new Error(`${filePath} is not valid JSON`)
  }
  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    throw new Error(`${filePath} must hold a JSON object`)
  }
  return json as Record<string, unknown>
}

export function readProjectFile(dir: string): ProjectFile | null {
  const json = readProjectJson(dir)
  if (!json) return null

  const filePath = path.join(dir, PROJECT_FILE_NAME)
  if (typeof json.gameKey !== "string" || !json.gameKey) {
    throw new Error(`${filePath} has no "gameKey"`)
  }
  if (json.base !== null && typeof json.base !== "string") {
    throw new Error(`${filePath} needs a "base" that is a string or null`)
  }
  return { gameKey: json.gameKey, base: json.base }
}

export function writeProjectFile(dir: string, project: ProjectFile) {
  fs.writeFileSync(
    path.join(dir, PROJECT_FILE_NAME),
    `${JSON.stringify({ ...readProjectJson(dir), ...project }, null, 2)}\n`
  )
}
