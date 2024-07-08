---
title: My Journey Making Javascript Games  
description: How I got to building multiplayer games on Dusk  
slug: my-journey-making-javascript-games 
tags: [Game Development] 
authors:
- name: Kevin Glass 
  title: Founding Engineer at Dusk  
  url: https://www.linkedin.com/in/kevglass/
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

Here at Dusk we're building a platform to help developers make multiplayer mobile games and get them out to plenty of players. The technology available to make games has made it easier over the last 30 years. When I started, getting sprites on the screen was the hard bit. That was back in (_muffled noises)_. Then it was getting 60fps. Then it was cross platform. Then it was 3D, and then it was mobile cross platform games that were the challenge. At each stage the bar gets raised and we can do more with less.

The next on the list for indie game developers like me is internet multiplayer - to many of us it's that scary and complicated piece that we don't think we can scale to. I've tried and failed multiple times to build something truly internet playable. It's not impossible, it's just hard. There's so much going on in the modern internet it's really hard to predict and design for all the network conditions you might encounter.

> **Tarn Adams (Dwarf Fortress)**: "Multiplayer development is like juggling chainsaws. Each element is complex on its own, but once you start adding other players into the mix, the complexity increases exponentially."

Different devices, CPU throttling, WIFI vs cell connection and different approaches to network all make the code itself hard to write. After that you need to think about optimizing latency with regional infrastructure. Even after you've got past the code and infrastructure complexity, you get to start working out how you're going to build a community big enough that there will be people online to play.

> **Rami Ismail (Vlambeer)**: "Making a multiplayer game is not just about coding the gameplay. It's about creating an infrastructure that can handle a community, and that’s an entirely different beast."

So, yes I work at Dusk now and of course I'm going to be slightly biased, but 5 months ago I didn't. I was quite happily leading an enterprise oriented company using every spare minute I had to think, work on and talk about games. Your typical hobbyist/indie developer, building games for the love of it and always having the next project in mind. I'd recently built both a moderately successful MMORPG and an online Terraria clone, so suffered the pains of writing my own networking. At this point I'm thinking about mini-games as a relief and the link to Dusk was passed to me by a friend.

The stack is Javascript/Typescript which happens to be where my game development had taken me (via BASIC/ASM/C/C++/Java/Unity) so it felt like a good fit. Having written a few games in the first month I was pleased with the outcome, playing them with my friends on the app was nice and it felt like a smooth process to get things working.

Did it solve everything for me with a click of its magical fingers? Of course not! You still have to think about your code and data structure, design your game for multi-player and consider the myriad of corner cases that multiplayer throws your way - you simply can't get away from that.

What it did do we was give me a free predict/rollback networking model (something I'll write about later), an infrastructure that meant players weren't always getting huge pings and framework in which I could stop thinking about how the networking was going to work and focus on the bits I enjoy - rendering, feel and game design.

So how do we actually build the game? You have a two pieces to build:

- **The Renderer** - here you can use whatever libraries or frameworks you like. There are games built with React, ThreeJS, PixiJS and many others already. The SDK is javascript based so it's easiest if you start there but I'm pretty sure some of the engine experts will find a way to integrate pretty quickly. For me I used plain Canvas and the other direct browser APIs to write my first game.
- **The Logic** - this code is going to run on the devices and on the server so there's one authoritative point. As such it's a bit more sensitive to what you can and can't use. It's still vanilla javascript and there are eslint plugins to guide your development here.

Most of us have this split in our game code even in single player games so it should feel pretty familiar to most game devs. The logic is about the raw data. The renderer is about translating that to and from the user. It's important of course, given the games are going to be running on mobile devices, that the code is pretty performant. Not just for player experience but for battery life.

In my case, for my first game, I decided to port a game I had just started working on over to Dusk to try it out. Making a multiplayer version of a traditional rogue/nethack game felt like a good first step. Since I'd already developed the game with a separate logic and rendering layers it was pretty quick to port over - and with the help of the amazing [doodle rogue tileset](https://chr15m.itch.io/doodle-rogue-tileset) it's looked pretty good too. I do like a ridiculous name, so that game became "Dungeons of Glee" (say in a deep voice!)

![](/img/blog/screenshots/dungeons-of-glee.png)

It was a surprisingly quick process. I think two evenings of game dev time took me from old prototype to deployable game. There was a quick round of review where the feedback was helpful and the game was out and ready to play!

As an expectant indie game dev, I waited with excitement to receive my first player stats email and see how wonderfully my game had done. Not well it turns out. One thing you have to get your head round is when you have this large potential player base, is doing some research on what type of players they are - really matters. Previously my game success had been based on reasonably small numbers, so I basically knew the type of player I was hitting.

In this environment I'd missed the mark considerably but I was lucky enough to get in contact with the people behind Dusk, they helped me to understand the player base and happily I now receive weekly emails with 1000s of hours of gameplay every week.

I liked the platform so much when I got the opportunity to join the company it really was a no-brainer for me, and here we are.

Am I still building games? Of course I am!
