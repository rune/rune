import { atom, useAtom } from "jotai"
import { useCallback } from "react"

type Flag = "panoramaHintShown" | "mapHintShown" | "startOfRoundShown"

const $flags = atom<Flag[]>([])

export function useFlags() {
  const [flags, setFlags] = useAtom($flags)

  return {
    isFlagSet: useCallback((flag: Flag) => flags.includes(flag), [flags]),
    setFlag: useCallback(
      (flag: Flag) => setFlags((flags) => [...flags, flag]),
      [setFlags]
    ),
    unsetFlag: useCallback(
      (flag: Flag) =>
        setFlags((flags) =>
          flags.filter((existingFlag) => existingFlag !== flag)
        ),
      [setFlags]
    ),
  }
}
