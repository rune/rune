import path from "path"
import url from "url"

// eslint-disable-next-line
// @ts-ignore
const dirname = path.dirname(url.fileURLToPath(import.meta.url))

export const rootPath = path.resolve(dirname, "../..")
