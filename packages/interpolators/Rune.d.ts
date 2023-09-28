import { RuneClient } from "rune-games-sdk"

declare global {
  // eslint-disable-next-line no-var
  var Rune: RuneClient<any, any>
}
