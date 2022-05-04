import express from "express"
import getPort from "get-port"
import path from "path"
import { useState, useEffect } from "react"

import { packageJson } from "../../lib/packageJson.js"
import { rootPath } from "../../lib/rootPath.js"

const appDir = path.resolve(rootPath, "app")

export function useAppServer({ gameUrl }: { gameUrl?: string }) {
  const [port, setPort] = useState<number | null>(null)

  useEffect(() => {
    if (!gameUrl || port) return

    getPort({ port: 3000 }).then((freePort) => {
      const appServer = express()

      appServer.get("/data", (_, res) => {
        res.json({
          cliVersion: packageJson.version,
          gameUrl,
        })
      })

      appServer.use("/", express.static(appDir))

      appServer.use("*", (_, res) => {
        res.sendFile(path.resolve(appDir, "index.html"))
      })

      appServer.listen(freePort, () => setPort(freePort))
    })
  }, [gameUrl, port])

  return port ? { port } : null
}
