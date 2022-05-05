import { postRuneEvent } from "./messageBridge"

export function setupErrorLogging() {
  // TODO remove runeWindowErrHandler usage when native app is migrated
  const errorHandler = globalThis.runeWindowErrHandler
    ? globalThis.runeWindowErrHandler
    : function (event: ErrorEvent) {
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
