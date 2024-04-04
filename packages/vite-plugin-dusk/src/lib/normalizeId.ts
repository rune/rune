import path from "node:path"

export function normalizeId(id: string) {
  //For some reason on windows some paths are returned with \x00 at the beginning. Remove it.
  const idWithoutNull = id.startsWith("\x00") ? id.slice(1) : id

  //Try to unify paths so that no matter what platform they run on they would use /.
  //This is necessary due to vite not providing platform specific paths in some cases
  const platformAgnosticId = idWithoutNull.split(path.sep).join("/")

  return platformAgnosticId
}
