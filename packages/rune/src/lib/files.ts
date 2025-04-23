import fs from "fs"
import path from "path"

export function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, "")
}

export const copy = async (src: string, dest: string) => {
  const stat = await fs.promises.stat(src)

  if (stat.isDirectory()) {
    await copyDir(src, dest)
  } else {
    await fs.promises.copyFile(src, dest)
  }
}

const copyDir = async (srcDir: string, destDir: string) => {
  await fs.promises.mkdir(destDir, { recursive: true })

  for (const file of await fs.promises.readdir(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    await copy(srcFile, destFile)
  }
}

export async function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }

  for (const file of await fs.promises.readdir(dir)) {
    if (file === ".git") {
      continue
    }

    await fs.promises.rm(path.resolve(dir, file), {
      recursive: true,
      force: true,
    })
  }
}
