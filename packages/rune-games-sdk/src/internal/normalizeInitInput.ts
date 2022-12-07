import { InitInput } from "../types"

// Alternative way to provide the score in some non-JS environments, where
// integration with JS does not allow to return values from callbacks.
export function normalizeInitInput(input: InitInput) {
  if (input?.getScore?.callbackReturnValueNotSupported) {
    const originalGetScore = input.getScore

    input.getScore = () => {
      originalGetScore()
      return originalGetScore.score
    }
  }
}
