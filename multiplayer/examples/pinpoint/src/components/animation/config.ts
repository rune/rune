export const timings = {
  default: 250,
  scoreReorder: 500,
  scoreIncrement: 1000,
}

export enum ScoreboardAnimationStep {
  map,
  background,
  old,
  latest,
  new,
  reorder,
  cta,
}

export const scoreboardAnimationStepTimings: {
  [S in ScoreboardAnimationStep]: number
} = {
  [ScoreboardAnimationStep.map]: 2000,
  [ScoreboardAnimationStep.background]: 1000,
  [ScoreboardAnimationStep.old]: 1000,
  [ScoreboardAnimationStep.latest]: 250,
  [ScoreboardAnimationStep.new]: 1000,
  [ScoreboardAnimationStep.reorder]: 1000,
  [ScoreboardAnimationStep.cta]: 0,
}
