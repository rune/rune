---
title: Is predict-rollback the future of multiplayer games?
description: Why we chose predict-rollback for Dusk
slug: is-predict-rollback-the-future-of-multiplayer-games
tags: [Game Development, Networking]
image: /img/blog/social-previews/is-predict-rollback-the-future-of-multiplayer-games.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Dusk  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Is predict-rollback the future of multiplayer games?</title>
  <meta property="og:title" content="Is predict-rollback the future of multiplayer games?"/>
</head>

At Dusk, the majority of the games on the platform are multiplayer. This is largely because we provide an SDK that enables JavaScript developers to build multiplayer experiences very easily, and our player base has come to expect it. Of course, as mentioned in [Modern Game Networking Models](https://developers.dusk.gg/blog/modern-game-networking-models), this means we focus on making the backend networking something special.

There are a lot of ways of making games multiplayer, from hot seat to shared screen and of course networking itself. Even in networking, there are multiple models to choose from each of which is suitable for a different type of game or programming complexity. 

If you’re building a network layer for a single game or a bunch of very similar games then choosing the network model that’s the easiest and satisfies those game constraints is the best move.

However, at Dusk, we’re pretty opinionated about a single model that works for all cases, predict-rollback. We need to provide a single common framework for all the games on Dusk and so we focus on one networking model that supports the massive variety of games on the platform.

## Predict-Rollback
	
In [Modern Game Networking Models](https://developers.dusk.gg/blog/modern-game-networking-models) we talked in a bit of detail about how predict-rollback works. In summary, we essentially let all clients continue moving forward *predicting* the current game state based on the inputs they know about. If another client provides a new input (via the authoritative server) that occurs before the game time the current client is at, we roll-back the game state, apply the input, and then re-predict the current state. 

So why do we think predict-rollback is the future of networking games and the best fit for a generic networking framework?

* Some great games have used it to provide excellent multiplayer experiences, like Rocket League and Street Fighter. They also do an amazing job of hiding the rollback/changes when they occur.
* It works for all cases, whether it's turn-based, RTS, or faster-paced twitch games; predict-rollback provides a stable, consistent approach. Even in turn-based games, where there should be no rollbacks, the simple simulation modified by inputs approach still fits the bill.
* There’s growing library and platform support. Unity, Godot, and even Valve’s Source engines all have plugins that support this model.

What’s so great about the model then?

* Low bandwidth—you only need to send the initial state and changes to that state. That’s pretty powerful right there. The variance in networks especially with the emerging nations becoming a huge consumer of games means this is super important.
* Best player experience—in many cases, it means that clients can run forward without latency between player input and response. Of course, you need to deal with conflicts when they occur, but this seems to be much easier than the alternatives.
* Most consistent implementation—once you’ve got [determinism](https://developers.dusk.gg/blog/making-js-deterministic-for-fun-and-glory) handled, it’s the most consistent approach across platforms and devices.. Every device acts the same and gets the same results.

What are the downsides? The process of rolling back and re-calculating the game state can be CPU heavy. Depending on your approach you may have to calculate many frames of change quickly based on the new input. However, this is why it’s now the right choice. Devices have reached a point where CPUs are extremely overpowered for what they’re trying to achieve in games - so there’s room to have a smart and utility based network model.

Of course, if you’re building a network model for a specific game, there are many tricks and game-specific approaches you could take.

If, however, you're building a library/framework that supports many types of games in many different environments and on different devices, predict-rollback is the right choice for now and the future.

Want to learn more about our approach or simply want to discuss the content of this article? Stop by our [Discord](https://discord.gg/dusk-devs) and let’s chat!


