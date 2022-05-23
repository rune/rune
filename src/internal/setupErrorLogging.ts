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
}
