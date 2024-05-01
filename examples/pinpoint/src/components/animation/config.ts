export const timings = {
  delayShort: 2000,
  delayLong: 4000,
  default: 250,
  scoreReorder: 500,
  scoreIncrement: 1000,
  mapLineDelay: 1000,
  mapDistanceDelay: 2000,
  newUserGuess: 5000,
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
  [ScoreboardAnimationStep.map]: 3000,
  [ScoreboardAnimationStep.background]: 1000,
  [ScoreboardAnimationStep.oldScores]: 750,
  [ScoreboardAnimationStep.latestScore]: 250,
  [ScoreboardAnimationStep.newScores]: 1000,
  [ScoreboardAnimationStep.newScoreOrder]: 1000,
  [ScoreboardAnimationStep.cta]: 0,
}
