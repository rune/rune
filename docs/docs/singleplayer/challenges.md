---
sidebar_position: 2
---

# Daily Challenges

Rune has built-in support for daily challenges. Why support daily challenges?

1. There's something new and exciting in your game every day. Different colors / maps / physics — it's completely up to your creativity and keeps your game entertaining for dedicated players!
2. Your game becomes deterministic, meaning that all players will have the same gameplay experience. This makes it more fun to compete!
3. Rune will automatically add daily challenge leaderboards for your game. Players love having a fresh leaderboard to compete on every day!

There are two ways to support daily challenges:

- [`Rune.getChallengeNumber`](api/singleplayer.md#runegetchallengenumber)
  - Suitable for iterating through a fixed set of levels / maps.
  - For example, a puzzle game with 20 different puzzles.
- [`Rune.deterministicRandom`](api/singleplayer.md#runedeterministicrandom)
  - Suitable for generating maps.
  - For example, a racing game where the turns in the racetrack and obstacles are randomly generated.
