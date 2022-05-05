import { postRuneEvent } from "../messageBridge"

export function setupErrorLogging() {
  globalThis.runeWindowErrHandler = function (event: ErrorEvent) {
    postRuneEvent({
      type: "WINDOW_ERR",
      err: {
        msg: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })
  }

  globalThis.addEventListener("error", window.runeWindowErrHandler)
}
