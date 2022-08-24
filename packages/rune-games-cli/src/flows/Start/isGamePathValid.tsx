import fs from "fs"
import path from "path"

export function isGamePathValid(gamePath: string) {
  return fs.existsSync(path.resolve(gamePath, "index.html"))
}
