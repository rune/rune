//This function overrides functionality of both localStorage and sessionStorage because they both depend on the same Storage object.
export function overrideStorage() {
  if (!globalThis.localStorage) return

  const notify = () => {
    console.error("Error! Local/Session storage is disabled when using Rune SDK.")
  }

  let storage: { [key: string]: unknown } = {}

  const storageProto = Object.getPrototypeOf(globalThis.localStorage)

  Object.defineProperties(storageProto, {
    getItem: {
      value: (key: string) => {
        notify()
        return key in storage ? storage[key] : null
      },
    },
    setItem: {
      value: (key: string, value: unknown) => {
        notify()
        storage[key] = value
      },
    },
    removeItem: {
      value: (key: string) => {
        notify()
        delete storage[key]
      },
    },
    clear: {
      value: () => {
        notify()
        storage = {}
      },
    },
    length: {
      value: () => {
        notify()
        return Object.keys(storage).length
      },
    },
    key: {
      value: (index: number) => {
        notify()
        const keys = Object.keys(storage)
        return keys[index] !== undefined ? keys[index] : null
      },
    },
  })
}
