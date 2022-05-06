import { getRuneSdk, RuneExport } from "./index"
import { clearStorage } from "./internal/clearStorage"
import { setupIframe } from "./internal/setupIframe"
import { setChallengeNumber } from "./internal/setChallengeNumber"
import { setupMessageBridge } from "./internal/setupMessageBridge"
import { setupErrorLogging } from "./internal/setupErrorLogging"
import { setupConsole } from "./internal/setupConsole"
import { getUrlParams } from "./internal/getUrlParams"

function setupBrowser(Rune: RuneExport) {
  const urlParams = getUrlParams()
  clearStorage()
  setupIframe(urlParams.enableInitialOverlayInBrowser)
  setChallengeNumber(Rune, urlParams.challengeNumber)
  setupMessageBridge(Rune, urlParams.useDocumentForPostMessages)
  setupErrorLogging()
  setupConsole()
}

const Rune = getRuneSdk()
setupBrowser(Rune)

//Make sure to not export anything else here
export default Rune
