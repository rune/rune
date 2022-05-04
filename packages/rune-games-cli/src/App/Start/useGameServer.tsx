import express from "express"
import getPort from "get-port"
import path from "path"
import { useState, useEffect } from "react"

export function useGameServer({ gamePath }: { gamePath?: string }) {
  const [port, setPort] = useState<number | null>(null)

  useEffect(() => {
    if (!gamePath || port) return

    getPort({ port: 3001 }).then((freePort) => {
      const gameServer = express()

      gameServer.use("/", express.static(path.resolve(gamePath)))

      gameServer.listen(freePort, () => setPort(freePort))
    })
  }, [gamePath, port])

  return port ? { port } : null
}
