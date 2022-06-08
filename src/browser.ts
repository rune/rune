import { getRuneSdk } from "./index"
import { clearStorage } from "./internal/clearStorage"
import { setupIframe } from "./internal/setupIframe"
import { setupMessageBridge } from "./internal/setupMessageBridge"
import { setupErrorLogging } from "./internal/setupErrorLogging"
import { setupConsole } from "./internal/setupConsole"
import { getUrlParams } from "./internal/getUrlParams"
import { setupForceMute } from "./internal/setupForceMute/setupForceMute"
import { checkSdkLoadedFirst } from "./internal/checkSdkLoadedFirst"

setupErrorLogging()
checkSdkLoadedFirst()

const {
  challengeNumber,
  enableInitialOverlayInBrowser,
  useDocumentForPostMessages,
  startMuted,
} = getUrlParams()
const { Rune, stateMachineService } = getRuneSdk({ challengeNumber })

clearStorage()
setupConsole()
setupIframe(enableInitialOverlayInBrowser)
setupForceMute(startMuted)

setupMessageBridge(stateMachineService, useDocumentForPostMessages)

// Make sure to not export anything else here
export default Rune
