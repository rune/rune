import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { copy } from "rune/lib/files.js"

const promptsDirectory = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../prompts"
)
const copilotInstructionsFileName = "copilot-instructions.md"

const createDirIfNotExists = async (dir: string) => {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true })
  }
}

export const addCopilotInstructions = async (
  projectPath: string
): Promise<boolean> => {
  const githubDir = path.join(projectPath, ".github")
  const copilotInstructionsPath = path.join(
    githubDir,
    copilotInstructionsFileName
  )

  if (fs.existsSync(copilotInstructionsPath)) {
    return false // Instructions already exist
  }

  await createDirIfNotExists(githubDir)
  await copy(
    path.join(promptsDirectory, copilotInstructionsFileName),
    path.join(githubDir, copilotInstructionsFileName)
  )
  return true
}
