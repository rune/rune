import { spawn } from "child_process"

export const installDependenciesForProject = async (params: {
  pathToProject: string
}): Promise<void> => {
  const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"

  return await new Promise((resolve, reject) => {
    const child = spawn(pkgManager, ["install"], {
      cwd: params.pathToProject,
      //Fixes issue when running on windows https://stackoverflow.com/a/54515183
      shell: process.platform === "win32",
    })

    child.on("error", (err) => {
      reject(err)
    })

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Child process exited with code ${code}`))
      } else {
        resolve(undefined)
      }
    })
  })
}
