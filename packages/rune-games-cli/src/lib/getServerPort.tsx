import { Server } from "net"

export function getServerPort(server: Server) {
  const address = server.address()

  if (!address || typeof address === "string") {
    throw new Error("Unexpected server address response")
  }

  return address.port
}
