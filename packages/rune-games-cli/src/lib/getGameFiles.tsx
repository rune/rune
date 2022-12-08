import fs from "fs/promises"
import globSync from "glob"
import { promisify } from "util"

const glob = promisify(globSync)

export interface FileInfo {
  content?: string | null
  path: string
  size: number
}

export async function getGameFiles(gameDir: string): Promise<FileInfo[]> {
  const paths = await glob(
    `${
      // glob can only work with forward slashes, but path module operates with
      // double backward slashes on Windows
      process.platform === "win32" ? gameDir.replace(/\\/g, "/") : gameDir
    }/**/*`,
    {
      nodir: true,
      // excluding files and directories that start with .
      dot: false,
    }
  )

  return Promise.all(
    paths.map(async (path) => ({
      path,
      size: (await fs.stat(path)).size,
      ...((path.endsWith("/index.html") || path.endsWith("/logic.js")) && {
        content: await fs.readFile(path, "utf-8"),
      }),
    }))
  )
}
