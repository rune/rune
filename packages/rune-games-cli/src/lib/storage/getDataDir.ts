import fs from "fs"
import os from "os"
import path from "path"

export function getDataDir() {
  const dataDir = (() => {
    if (process.platform === "win32") {
      if (!process.env.LOCALAPPDATA) throw new Error("LOCALAPPDATA not found")

      return path.resolve(process.env.LOCALAPPDATA, "Rune/data")
    }

    return path.resolve(os.homedir(), ".rune/data")
  })()

  fs.mkdirSync(dataDir, { recursive: true })

  return dataDir
}
