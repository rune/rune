import { Rune } from "./index"
import { clearStorage } from "./internal/clearStorage"
import { setupIframe } from "./internal/setupIframe"
import { getChallengeNumber } from "./internal/getChallengeNumber"
import { setupMessageBridge } from "./internal/setupMessageBridge"

function setupBrowser() {
  clearStorage()
  setupIframe()
  getChallengeNumber()
  setupMessageBridge()
}

setupBrowser()

//Make sure to not export anything else here
export default Rune
