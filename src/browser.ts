import { getRuneSdk } from "./index"
import { clearStorage } from "./internal/clearStorage"
import { setupIframe } from "./internal/setupIframe"
import { setupMessageBridge } from "./internal/setupMessageBridge"
import { setupErrorLogging } from "./internal/setupErrorLogging"
import { setupConsole } from "./internal/setupConsole"
import { getUrlParams } from "./internal/getUrlParams"

const {
  challengeNumber,
  enableInitialOverlayInBrowser,
  useDocumentForPostMessages,
} = getUrlParams()
const { Rune, stateMachineService } = getRuneSdk({ challengeNumber })

clearStorage()
setupErrorLogging()
setupConsole()
setupIframe(enableInitialOverlayInBrowser)

setupMessageBridge(stateMachineService, useDocumentForPostMessages)

//Make sure to not export anything else here
export default Rune
