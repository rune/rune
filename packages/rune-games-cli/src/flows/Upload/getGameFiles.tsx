import fs from "fs"
import glob from "glob"

export function getGameFiles(gameDir: string) {
  return glob
    .sync(
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
    .map((path) => ({
      path,
      size: fs.statSync(path).size,
      ...(path.endsWith("/index.html") && {
        content: fs.readFileSync(path, "utf-8"),
      }),
    }))
}
