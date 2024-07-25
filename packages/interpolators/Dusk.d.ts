import { DuskClient } from "dusk-games-sdk"

declare global {
  // eslint-disable-next-line no-var
  var Dusk: DuskClient<any, any>
}
