import path from "path"
import url from "url"

export const rootPath = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "../.."
)
