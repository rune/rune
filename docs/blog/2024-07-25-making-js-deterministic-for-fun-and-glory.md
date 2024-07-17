---
title: Making JS deterministic for fun and glory  
description: Networking often requires cross platform deterministic outcomes - how can JS do that? 
slug: making-js-deterministic-for-fun-and-glory 
tags: [Game Development, Networking]
image: /img/blog/social-previews/making-js-deterministic-for-fun-and-glory.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Dusk  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Making JS deterministic for fun and glory</title>
  <meta property="og:title" content="Making JS deterministic for fun and glory"/>
</head>

Dusk is a platform for multiplayer games, so as you can imagine the networking code is core to what we do.

The initial approach that people take to game networking is to send all of the game state across the network every frame. This doesn’t scale, imagine you’re playing an RTS with 1000 units each - the network simply won’t support sending that much data all the time.

Most network strategies only send the inputs from the client across the network, so in our example: send these 50 units to position X. This works by having all the clients maintain their own game state and applying the received inputs to that. 

![](/img/blog/callouts/determinism-diagram.png)

Games make sure everyone starts from the same point. Then we apply the same changes to all the game states and expect them to stay in synchronization. This is called determinism - if we’re at state X and we apply change Y then we end up at state Z. 

This sounds like the sort of thing a computer would be really good at, but unfortunately most programming languages and computer specifications are written in English. This means that often things are left open for interpretation. This happens because either a) the author(s) didn’t consider it, or b) the specification wanted to let implementers have flexibility.  

When it comes to determinism, details count, especially when you’re dealing with a wide variety of devices and runtimes. If the result of math operation on device A is 0.001 different to device B then the resulting direction and final game state can be massively different. Consider if that value is the angle that you’re flying in a game, and then you go on to fly 10^6 units forward. Your positions are now significantly different.

Here at Dusk we have this exact problem, JavaScript isn’t consistent across devices and runtimes. We do of course need all of them to react to game state changes in the exact same way. The bright side, thanks to JavaScript, we’re able to patch the parts that aren’t deterministic. 

So what needed patching?

## Math Functions

The first place to start is all of those functions on the `Math` object, and the warning sign is right there on MDN page:

> Note: Many Math functions have a precision that's implementation-dependent.
>
> This means that different browsers can give a different result. Even the same JavaScript engine on a different OS or architecture can give different results!

Outside of the constants nearly all the functions need patching to ensure that everyone in a game returns the same result. This simply means that all the results need to be rounded to a common precision, namely Single-precision floating-point format. Luckily there is a `Math` function that does exactly that.

So, does this break anything? No, not really. Results are still accurate enough for games to function normally. There is one exception to all of this that we’ll see next.

## Random Numbers

The second piece of the puzzle is random numbers. One of the things that most developers know is there’s no such thing as random numbers in computers, only pseudo random numbers. So you’d think it’d be perfect for determinism - unfortunately not. 

The `Math.random()` specification is Javascript is deliberately vague to allow runtime implementers to have freedom to build appropriately. Worse than that the specification doesn’t support passing in a seed so there is no way to start the random number generation in a predictable manner.

First stop, we’ll patch `Math.random()` with a custom seeded random number generator function. There are many well documented out there in the public domain. Brilliant, that gets us deterministic! 

In Dusk however we use the predict-rollback networking model, which requires us to be able to rollback time and reapply events to our game state. But what if we generated random numbers? A pure seed isn’t enough anymore because we want to generate the same random numbers we generated back when we first ran that time step of logic. 

To solve this problem we have to keep track of the seed independently and allow for rolling back to previous seeds. With that approach we now have a fully deterministic random numbers event with rollbacks!

## Sorting and Shuffling

A very common action in games programming is to sort an array. Whether that’s for z-sorting in 2D or line of sight checking. What’s more than shuffling an array for game logic is often done using a combination of `Math.random()` and sorting. Javascript of course has array sorting built in but unfortunately the exact details of that array sort vary between implementations - especially in regard to strings.

Again MDN has a little hint:

> Due to this implementation inconsistency, you are always advised to make your comparator well-formed by following the five constraints.

There’s a decent chance that a developer will accidentally use a comparator that doesn’t quite end up with the same result on different implementations. To remedy this we can patch the `Array.prototype.sort` function with a default comparator.

## Bonus Content!

The other thing we can do is help developers to recognize when their code might produce non-deterministic results. There are many possible causes of this including access to global scope and using locale related functions.
As you can see determinism in Javascript isn’t straight forward but it is obtainable. We now have games running in perfect synchronization.

If you have comments or want to learn more head over to the [Discord](https://discord.gg/dusk-devs).
