import { detectLocalIP } from "../../lib/detectLocalIP.js"

const localIp = detectLocalIP()

export function getLocalUrls(port?: number) {
  const urls: {
    localhost: string | null
    ip: string | null
  } = {
    localhost: null,
    ip: null,
  }

  if (!port) return urls

  urls.localhost = `http://localhost:${port}`

  if (localIp) urls.ip = `http://${localIp}:${port}`

  return urls
}
