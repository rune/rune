---
title: 'Game Spotlight: Melancia'
description: Spotlight on the Rune based game, Melancia
slug: game-spotlight-melancia
tags: [Game Spotlight]
image: /img/blog/social-previews/game-spotlight-melancia.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Rune  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Game Spotlight: Melancia</title>
  <meta property="og:title" content="Game Spotlight: Melancia"/>
</head>

At the core of Rune, we have games being enjoyed by millions of players. I’m glad to take the time to celebrate one of them, Melancia, that has been doing very well on the platform. This wonderful game was made by [jallen](https://x.com/jallen_dev).

![](/img/blog/callouts/melancia.png)

[Play Melancia Now](https://join.rune.ai/game/bRcvMKaL--)

## What’s the Game?

Deceptively simple, the game features a Tetris-style well in which the player drops brightly colored fruits. When two fruits of the same type collide, they combine to make the next bigger fruit. The aim, as the name of the game may give away, is to make melons by combining all the other fruits. Other players are also playing in their own wells, trying to get to the melons before you.

It’s a clean concept implemented with especially satisfying physics and sounds that evidently keep players coming back for more. There’s something very delightful about the pop as you make your next fruit combinations.

## What’s Great About It?

Things that seem to work about Melancia on Rune (good tips for other devs):

* Simple, understandable mechanics with no text to read
* Bright and obvious graphical style
* Physics—especially shared physics—make for a pleasing experience
* Easy controls for mobile

## How Does It Work on Rune?

The game was implemented on the Rune SDK without having to change anything or take any special measures. If you’d like to see for yourself, the source is open:

https://github.com/jallen-dev/rune-games/tree/main/games/melancia-game

The game was built over the course of a week, which, while short for game development, is pretty common amongst Rune games. It doesn’t take months of work to put out something to millions of players!

## Developer Interview 

Jallen was kind enough to answer a few questions for us on the game and the development process.

**How long have you building games?**

> About a year. I'm originally a web dev who has been easing into gamedev by making games in React, [pixi.js](https://pixijs.com/) and [three.js](https://threejs.org/).

**What gave you the idea for the game?**

> It's heavily inspired by the game "Suika Game" which went viral last year. The main way Melancia Game differs is it's multiplayer and a race against the clock. It also puts less emphasis on the puzzle aspect, since there is no penalty for your fruit spilling out of the top of the container.

**How long did the game take to build?**

> 1 week. I started it on March 12 and it went live on March 19.

**What was the most fun bit of the game to develop?**

> Figuring out how to get the physics library to play nicely with Rune. It was a fun challenge to solve, and I tested a few different solutions. What I ended up going with is having the client send the position/rotation/velocity of every fruit each time it drops a new fruit, so that the other clients can sync. Since each player has their own separate container of fruit, it's not really a problem to let each client be the source of truth for that player's fruit state.

**Did you expect the game to be successful?**

> I had a feeling it would do well, since it's based on a hit game. I think my changes to the gameplay also helped it be a better fit for Rune's audience. It's faster-paced and requires less deliberation, which is ideal for a casual game over voice chat. Still, I was surprised by just how well it has done.

**What would you different next time?**

> Use [propel-js](https://github.com/kevglass/propel-js/) to do the physics logic side. My solution with syncing state is a bit of a hack. Plus having the physics in logic would enable new features, like players sharing the same container (i.e. a co-op mode).

**How did you find Rune to work with?**

> It's fantastic. Small API surface, not opinionated about what you use to build your game's client. I think it's great for most types of web games.

**Anything else you'd like to say?**

> If you liked this game you might like another one of my games that shared the same inspiration: https://coinjargame.com/

## What Do the Players Think?

One player comments:

> The game is just cool

Another player says:

> The game is simply top

I think they like it! Thanks so much to [jallen](https://x.com/jallen_dev) for building the game and giving joy to so many players around the world.

If you’d like to talk about the game, learn how it was built, or build your own, drop in at the [Discord](https://discord.gg/rune-devs).