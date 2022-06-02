import { getUrlParams } from "../getUrlParams"

export const forceMute = {
  enabled: getUrlParams().startMuted,
}
