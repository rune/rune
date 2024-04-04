import fs from "fs"
import os from "os"
import path from "path"

const stage = process.env.STAGE ?? "production"

export function getDataDir() {
  const dataDir = (() => {
    if (process.platform === "win32") {
      if (!process.env.LOCALAPPDATA) throw new Error("LOCALAPPDATA not found")

      return path.resolve(process.env.LOCALAPPDATA, `Dusk/data/${stage}`)
    }

    return path.resolve(os.homedir(), `.dusk/data/${stage}`)
  })()

  fs.mkdirSync(dataDir, { recursive: true })

  return dataDir
}
