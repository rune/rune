// We clear the storage each time we reload the game.
export function clearStorage() {
  if (globalThis.localStorage) {
    globalThis.localStorage.clear()
  }

  if (globalThis.sessionStorage) {
    globalThis.sessionStorage.clear()
  }
}
