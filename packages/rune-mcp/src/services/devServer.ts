import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { ChildProcess, spawn } from "child_process"
import open from "open"

interface ServerUrls {
  localUrl: string
  networkUrls: string[]
}

let devServer: ChildProcess | null = null
let localUrl = ""
let networkUrls: string[] = []
let currentProjectPath: string = ""

/**
 * Check if the development server is currently running
 * @returns boolean indicating if the server is running
 */
export const isDevServerRunning = (): boolean => {
  return devServer !== null && !devServer.killed
}

/**
 * Get the URLs for the currently running development server
 * @returns object containing localUrl and networkUrls
 */
export const getDevServerUrls = (): ServerUrls => {
  if (!isDevServerRunning()) {
    throw new Error("Development server is not running")
  }

  return {
    localUrl,
    networkUrls,
  }
}

/**
 * Get the current project path for the running dev server
 * @returns string with the current project path or empty string if not running
 */
export const getCurrentProjectPath = (): string => {
  return currentProjectPath
}

/**
 * Set the current project path
 * @param path - The path to set as the current project path
 */
export const setCurrentProjectPath = (path: string): void => {
  currentProjectPath = path
}

export const startDevServer = async ({
  pathToProject,
  server,
}: {
  pathToProject: string
  server: McpServer
}): Promise<ServerUrls> => {
  server.server.sendLoggingMessage({
    level: "info",
    data: "Stopping existing dev server if running...",
  })
  await stopDevServer()
  const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"
  process.chdir(pathToProject)
  setCurrentProjectPath(pathToProject)
  server.server.sendLoggingMessage({
    level: "info",
    data: "Starting dev server...",
  })
  devServer = spawn(pkgManager, ["run", "dev", "--clearScreen=false"], {
    //Fixes issue when running on windows https://stackoverflow.com/a/54515183
    shell: process.platform === "win32",
  })

  // Wait for server to start and extract URLs
  const urls = await new Promise<ServerUrls>((resolve, reject) => {
    if (!devServer || !devServer.stdout) {
      server.server.sendLoggingMessage({
        level: "error",
        data: "Failed to start dev server: no stdout",
      })
      reject(new Error("Failed to start dev server"))
      return
    }

    let stdoutBuffer = ""

    const timeout = setTimeout(() => {
      server.server.sendLoggingMessage({
        level: "error",
        data: "Timeout waiting for dev server to start",
      })
      cleanupListeners()
      reject(new Error("Timeout waiting for dev server to start"))
    }, 30000) // 30 second timeout

    // Define event handlers as named functions so we can remove them
    const onData = (data: Buffer) => {
      // Append new output to our buffer
      stdoutBuffer += data.toString()

      // Check if we've received the key phrase indicating server is ready
      if (data.toString().includes("Visit page on mobile")) {
        clearTimeout(timeout)

        // Extract URLs using regex
        const localUrlMatch = stdoutBuffer.match(
          /Local:\s+(http:\/\/localhost:\d+\/)/
        )
        const networkUrlMatches = Array.from(
          stdoutBuffer.matchAll(/Network:\s+(http:\/\/[\d.]+:\d+\/)/g)
        )

        // Get the local URL
        localUrl = localUrlMatch?.[1] || ""

        // Get all network URLs
        networkUrls = networkUrlMatches.map((match) => match[1])

        if (localUrl && networkUrls.length > 0) {
          cleanupListeners()
          resolve({
            localUrl,
            networkUrls,
          })
        } else {
          cleanupListeners()
          reject(new Error("Could not extract server URLs from output"))
        }
      }
    }

    const onError = (err: Error) => {
      server.server.sendLoggingMessage({
        level: "error",
        data: `Error from dev server: ${err}`,
      })
      clearTimeout(timeout)
      cleanupListeners()
      reject(new Error(`Failed to start dev server: ${err.message}`))
    }

    const onClose = (code: number | null) => {
      server.server.sendLoggingMessage({
        level: "info",
        data: `Dev server closed with code: ${code}`,
      })
      if (code !== 0) {
        clearTimeout(timeout)
        cleanupListeners()
        reject(new Error(`Dev server exited with code ${code}`))
      }
    }

    // Function to remove all listeners
    const cleanupListeners = () => {
      if (devServer?.stdout) {
        devServer.stdout.removeListener("data", onData)
      }
      if (devServer) {
        devServer.removeListener("error", onError)
        devServer.removeListener("close", onClose)
      }
    }

    // Attach event listeners
    devServer?.stdout?.on("data", onData)
    devServer.on("error", onError)
    devServer.on("close", onClose)
  })

  // These listeners are for the lifetime of the server
  devServer?.stdout?.on("data", (data: Buffer) => {
    server.server.sendLoggingMessage({
      level: "info",
      data: `Dev server: ${data.toString()}`,
    })
  })

  devServer?.on("error", (err) => {
    server.server.sendLoggingMessage({
      level: "error",
      data: { message: `Dev server error: ${err.message}`, stack: err.stack },
    })
  })

  devServer?.on("close", (code) => {
    if (code !== 0) {
      server.server.sendLoggingMessage({
        level: "error",
        data: { message: `Dev server exited with code ${code}` },
      })
    } else {
      server.server.sendLoggingMessage({
        level: "info",
        data: "Dev server stopped",
      })
    }

    devServer = null
    localUrl = ""
    networkUrls = []
    currentProjectPath = ""
  })

  return urls
}

export const stopDevServer = async (): Promise<void> => {
  if (devServer) {
    // Wait for the process to exit or force kill after timeout
    await new Promise<void>((resolve) => {
      let timeout: NodeJS.Timeout | undefined = undefined
      devServer?.once("exit", () => {
        clearTimeout(timeout)
        resolve()
      })

      // Gracefully stop the dev server
      devServer?.kill("SIGTERM")

      timeout = setTimeout(() => {
        devServer?.kill("SIGKILL")
        resolve()
      }, 5000)
    })

    devServer = null
    localUrl = ""
    networkUrls = []
    currentProjectPath = ""
  }
}

export const openDevServerInBrowser = async (): Promise<void> => {
  if (!devServer) {
    throw new Error("Dev server is not running")
  }

  await open(localUrl)
}
