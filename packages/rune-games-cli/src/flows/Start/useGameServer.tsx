import cors from "cors"
import express from "express"
import http from "http"
import path from "path"
import { useState, useEffect } from "react"

import { choosePort } from "../../lib/choosePort.js"
import { getServerPort } from "../../lib/getServerPort.js"
import { storage } from "../../lib/storage/storage.js"

const preferredPort = 3001

export function useGameServer({ gamePath }: { gamePath?: string }) {
  const [port, setPort] = useState<number | null>(null)

  useEffect(() => {
    if (!gamePath || port) return

    choosePort([preferredPort, storage.get("lastRandomGamePort")]).then(
      (portToUse) => {
        const gameServer = express()

        gameServer.use(cors())
        gameServer.use("/", express.static(path.resolve(gamePath)))

        const server = http.createServer(gameServer)
        server.listen(portToUse, () => setPort(getServerPort(server)))
      }
    )
  }, [gamePath, port])

  useEffect(() => {
    if (port && port !== preferredPort) storage.set("lastRandomGamePort", port)
  }, [port])

  return port ? { port } : null
}
