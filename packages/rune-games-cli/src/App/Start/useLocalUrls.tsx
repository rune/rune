import { detectLocalIP } from "../../lib/detectLocalIP.js"

const localIp = detectLocalIP()

export function useLocalUrls(port?: number) {
  if (!port) return []

  const urls = [`http://localhost:${port}`]

  if (localIp) urls.push(`http://${localIp}:${port}`)

  return urls
}
