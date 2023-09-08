import * as panoramas from "../src/lib/data/panoramas.json"
import * as fs from "fs"

function generatePanoramaLogic() {
  const panoramasLogic = `export const panoramas: [number, number][] = JSON.parse('${JSON.stringify(
    panoramas.map(({ longitude, latitude }) => [longitude, latitude])
  )}')`

  fs.writeFileSync("./src/lib/data/panoramasLogic.ts", panoramasLogic, "utf-8")
}

generatePanoramaLogic()
