export function disableLocalStorage() {
  if (!globalThis.localStorage) return

  const noop = () => {
    console.error("WARNING! Local storage is disabled when using Rune SDK.")
  }

  const getItem = () => {
    noop()
    // We always return null to imitate empty local storage.
    return null
  }

  const localStorageProto = Object.getPrototypeOf(globalThis.localStorage)

  Object.defineProperties(localStorageProto, {
    getItem: {
      value: getItem,
    },
    setItem: {
      value: noop,
    },
    removeItem: {
      value: noop,
    },
    clear: {
      value: noop,
    },
  })
}
