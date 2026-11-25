import "./style.css"
import beepUrl from "./beep.wav"

Rune.initClient({
  onChange: async ({ game }) => {
    const { describe } = await import("./describe.js")
    document.getElementById("root")!.innerHTML = describe(game.count, beepUrl)
  },
})
