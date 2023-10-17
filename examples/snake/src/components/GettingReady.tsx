import { useAtomValue } from "jotai"
import { $readyPlayerIds } from "../state/state.ts"

export function GettingReady() {
  const readyPlayerIds = useAtomValue($readyPlayerIds)

  return (
    <div
      style={{ color: "white", position: "absolute", left: "50%", top: "50%" }}
    >
      <div>{readyPlayerIds.length} players ready</div>
      <button onClick={() => Rune.actions.setReady()}>ready</button>
    </div>
  )
}
