import os from "os"

export function detectLocalIP() {
  const nets = os.networkInterfaces()

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) return net.address
    }
  }

  return null
}
