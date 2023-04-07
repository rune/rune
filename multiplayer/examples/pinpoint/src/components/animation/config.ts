export const timings = {
  default: 250,
  scoreReorder: 500,
  scoreIncrement: 1000,
}

export enum ScoreboardAnimationStep {
  map,
  background,
  oldScores,
  latestScore,
  newScores,
  newScoreOrder,
  cta,
}

export const scoreboardAnimationStepTimings: {
  [S in ScoreboardAnimationStep]: number
} = {
  [ScoreboardAnimationStep.map]: 2000,
  [ScoreboardAnimationStep.background]: 1000,
  [ScoreboardAnimationStep.oldScores]: 1000,
  [ScoreboardAnimationStep.latestScore]: 250,
  [ScoreboardAnimationStep.newScores]: 1000,
  [ScoreboardAnimationStep.newScoreOrder]: 1000,
  [ScoreboardAnimationStep.cta]: 0,
}
