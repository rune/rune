import { deep } from "./shared/deep"
import { client } from "./client-only"

Rune.initClient({
  onChange: ({ game }) => {
    document.getElementById("root")!.innerHTML = JSON.stringify({
      deep,
      client,
      game,
    })
  },
})
