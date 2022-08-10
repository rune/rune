import { postRuneEvent } from "./messageBridge"

export function setupErrorLogging() {
  const errorHandler = function (event: ErrorEvent) {
    postRuneEvent({
      type: "WINDOW_ERR",
      err: {
        msg: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })

    return true
  }

  globalThis.addEventListener("error", errorHandler)

  // Setup alert tracking. This might be useful to find more about issues related to webgl
  const originalWindowAlertHandler = globalThis.alert

  globalThis.alert = function (message: string) {
    postRuneEvent({
      type: "WINDOW_ALERT",
      message,
    })

    originalWindowAlertHandler(message)
  }
}
