import { useAtomValue } from "jotai"
import { $timer } from "../state/state.ts"

export function Countdown() {
  const timer = useAtomValue($timer)

  return (
    <div
      style={{ position: "absolute", color: "white", left: "50%", top: "50%" }}
    >
      {Math.ceil(timer)}
    </div>
  )
}
