---
sidebar_position: 60
---

# Randomness

:::tip

**TLDR**: just use `Math.random()`

:::

Most games involve some kind of randomness, for example to roll a die in the case of Yahtzee. However, randomness introduces some problems:

- True randomness is inherently **not deterministic**, which is not compatible with Rune's distributed game state model.
- True randomness with optimistic updates places trust in the client, and therefore **opens up to cheating** for a technically sophisticated player.

## Deterministic random {#deterministic-random}

Rune solves this problem by implementing a deterministic pseudorandom number generator. In simpler words this means the Rune server tells each player client to calculate random numbers. For every action the player takes, the server verifies that the random numbers being generated are in fact generated in the way the server told it to.

What's great about it is that the game can do optimistic updates which leads to a really fast game, and that cheating is hard as the player client only knows how to generate their own numbers and cannot know what the other players will get.

## Things to keep in mind {#things-to-keep-in-mind}

Rune solves this transparently and in the majority of cases **you can keep using `Math.random()`** as you would in any other game. There are some specific things to keep in mind however:

### Keep all shared state in `logic.js` {#keep-all-shared-state-in-logicjs}

This isn't limited to randomness, but is especially important here, as only the code called from within `Rune.initLogic()`/`logic.js` has the deterministic random. If you have some kind of initialization code that generates data for your game, make sure to do this in `setup()` so that all players see the same thing.

### Shared random {#shared-random}

If your games needs deterministic shared randomness, meaning that the randomness is determined by the order an action is taken, regardless of who makes an action. This can be solved in different ways depending on the needs:

- Set a shared random state in `setup()` using `Math.random()` to be used in your own number generator.
- Generate all state that depends on randomness in `setup()` such as the board in a collaborative minesweeper game.
