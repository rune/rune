import { RuneClient } from "rune-sdk"

declare global {
  // eslint-disable-next-line no-var
  var Rune: RuneClient<any, any>
}
