import { deep } from "./shared/deep.js"
// eslint-disable-next-line
//@ts-ignore
import sum from "math-sum"

Rune.initClient({
  onChange: ({ game }: { game: any }) => {
    sum([1, 2, 3])
    document.getElementById("root")!.innerHTML = JSON.stringify({
      deep,
      game,
    })
  },
})
