import fs from "fs/promises"
import globSync from "glob"
import { promisify } from "util"

const glob = promisify(globSync)

export async function getGameFiles(gameDir: string) {
  const paths = await glob(`${gameDir}/**/*`, { dot: true, nodir: true })

  return Promise.all(
    paths.map(async (path) => ({
      path,
      size: (await fs.stat(path)).size,
      ...(path.endsWith("/index.html") && {
        content: await fs.readFile(path, "utf-8"),
      }),
    }))
  )
}
