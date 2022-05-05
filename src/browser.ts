import { getRuneSdk, RuneExport } from "./index"
import { clearStorage } from "./internal/clearStorage"
import { setupIframe } from "./internal/setupIframe"
import { getChallengeNumber } from "./internal/getChallengeNumber"
import { setupMessageBridge } from "./internal/setupMessageBridge"
import { setupErrorLogging } from "./internal/setupErrorLogging"
import { setupConsole } from "./internal/setupConsole"

function setupBrowser(Rune: RuneExport) {
  clearStorage()
  setupIframe()
  getChallengeNumber(Rune)
  setupMessageBridge(Rune)
  setupErrorLogging()
  setupConsole()
}

const Rune = getRuneSdk()
setupBrowser(Rune)

//Make sure to not export anything else here
export default Rune
