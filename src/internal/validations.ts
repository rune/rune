import { InitInput } from "../types"

export function validateScore(score: unknown) {
  if (typeof score !== "number") {
    throw new Error(`Score is not a number. Received: ${typeof score}`)
  }
  if (score < 0 || score > Math.pow(10, 9)) {
    throw new Error(`Score is not between 0 and 1000000000. Received: ${score}`)
  }
  if (!Number.isInteger(score)) {
    throw new Error(`Score is not an integer. Received: ${score}`)
  }
}

export function validateInput({
  restartGame,
  resumeGame,
  pauseGame,
  getScore,
}: Partial<InitInput> = {}) {
  if (typeof resumeGame !== "function") {
    throw new Error("Invalid resumeGame function provided to Rune.init()")
  }
  if (typeof pauseGame !== "function") {
    throw new Error("Invalid pauseGame function provided to Rune.init()")
  }
  if (typeof getScore !== "function") {
    throw new Error("Invalid getScore function provided to Rune.init()")
  }
  if (typeof restartGame !== "function") {
    throw new Error("Invalid restartGame function provided to Rune.init()")
  }

  validateScore(getScore())
}
