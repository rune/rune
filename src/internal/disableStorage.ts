//This function disables functionality of both localStorage and sessionStorage because they both depend on the same Storage object.
export function disableStorage() {
  if (!globalThis.localStorage) return

  const noop = () => {
    console.error("Error! Local/Session storage is disabled when using Rune SDK.")
  }

  const getItem = () => {
    noop()
    // We always return null to imitate empty storage.
    return null
  }

  const storageProto = Object.getPrototypeOf(globalThis.localStorage)

  Object.defineProperties(storageProto, {
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
    length: {
      value: 0,
    },
    key: {
      value: getItem,
    },
  })
}
