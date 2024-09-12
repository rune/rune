---
title: Gotchas in Multiplayer Game Design  
description: Common themes in problems faced during multiplayer game design 
slug: gotchas-in-multiplayer-game-design 
tags: [Game Development, Networking]
image: /img/blog/social-previews/gotchas-in-multiplayer-game-design.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Rune  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Gotchas in Multiplayer Game Design</title>
  <meta property="og:title" content="Gotchas in Multiplayer Game Design"/>
</head>

I’ve written a few multiplayer games and seen patterns in the things I got wrong across projects. As part of my work here at Rune I’m getting to see more and more developers making network games and there’s definitely some common themes in the problems they face.

When you write a lot of single player games it’s easy to get into habits that make game development faster. For instance, knowing that your data model is as fast to update and as your rendering is a real bonus when trying to move quickly from concept to MVP. Some of these habits can make multiplayer game development harder, so here’s a few things to think about when you’re building your next hit game.

![](/img/blog/social-previews/gotchas-in-multiplayer-game-design.png)

## Players Leaving and Joining

In a session/room based game players can leave and join at will. This might be due to active choices, connection issues or being removed from the game. For each player we’re normally holding state - that could be their position, the items they're holding or their score. 

What happens when a player leaves the game? The state could just be deleted and the other players carry on without them. There’s room for interesting game design here though, where a leaving player gives their state/progress to other players. Maybe the player needs to leave a marker where they were. Even more, what if a leaving player has a detrimental effect on others - encouraging people to keep playing? Do we need to adjust the difficulty of the game based on the number of players?

What happens when a player joins the game mid-way through? They could become a spectator of the game, they could jump in with the other players at their current point. Is there any bonus for players joining? Again, consider if we need to scale the difficulty of the game based on the new player count.

What happens if a player leaves and then re-joins quickly? This might mean they just lost connection, so consider a grace period. Rejoining players often get their state reset, check if this can be used as an exploit. If there is a way to gain through rejoining, players *will* find it.
 
## Determinism

As described [last week](https://developers.rune.ai/blog/making-js-deterministic-for-fun-and-glory), determinism in multiplayer games is often key to the network model. It’s quite easy to make a deterministic data model that ends up being non-deterministic on the rendering side. Pay special attention to how the renderer converts the inputs given from the network data model - a common issue is running animations independently from the synchronized data model resulting in different player interpretations of whats happened.

Be intentional when making effects take place on the client side that aren’t driven by shared data.

## Player Interactions and Rollbacks

Interactions between players are always hard in networked games, of course it’s where the fun is too. Thinking about interactions up front is critical to making a game “feel” right. These interactions generally fall into the following categories from easiest to hardest to get right:

1. **Data exchange** - like swapping or sharing objects and consumables. In these cases there’s nothing real time visual to see (other than stats or inventories updating) so delay doesn’t feel bad. These are an easy win to make a game feel multiplayer.
1. **Out of band effects** - like power-ups that affect other players. We see these in popular carting games, you collect an item, use it and all the other players get their screen blacked out or become mini versions etc. The nice thing about these is that they can be delayed slightly from the player input without it seeming wrong - meaning that latency can be absorbed. 
1. **Ranged Interactions** - like shooting an opponent. These are still latency and rollback sensitive but visually the rollback won’t look so bad because it’s so far away. If you appear to hit but actually miss the player doesn’t feel quite so cheated. 
1. **Close Interactions** - like two players pushing each other around. These are by far the hardest to get right, which is why so many multiplayer games ignore them. The latency really hurts here. e.g. the remote player stops moving and you get a rollback causing a sudden movement in the shared object. They can be mitigated with slow moving objects and by using acceleration in the player.

Categorizing your interactions early on can help you both choose a networking model and de-scope features that will make your game either too hard to implement or unsatisfying as an experience.

## What to Synchronize

In contrast to Determinism above, sometimes the first stop of a developer working on a multiplayer game is to synchronize everything. I know I fall into this trap regularly. At the least it means you’re sending more across the wire than you need to but at worst you can be causing rollbacks for things that don’t matter. 

I repeat, be intentional when making effects take place on the client side that aren’t driven by shared data.

## Player Base Size

One of the hardest things as an indie game developer is getting from your early access build to something popular enough to have regular players. This means when you’re designing your multiplayer experience for large groups you need to keep in mind in the early days it’ll likely be much fewer, or even solo play. 

Even if it's temporary, having a design that's flexible enough to make it fun for solo play and then grow into multiplayer is great. Once your game is off and running you can throw the solo aspects away if needed.

Equally knowing the upper end of the players supported by your design is important. Designing for small groups brings different complexities than designing for massively multiplayer numbers. Of course depending on the game you might end up with some aspects for each.

## Real Life Internet

As mentioned in [game networking models](https://developers.rune.ai/blog/modern-game-networking-models), the real internet isn’t always smooth sailing. High latency is pretty common as is varying latency on a single connection. Try to think about how the game will feel with players on significantly different network connections. Accessibility-wise you want to get as many players on board as possible, so this may well mean that not all connections are equal.

I’ve seen a couple of games out there that have a lag bonus - if your connection was poor or unstable you get an easier ride in the game. With the right tuning this feels like it could be a good solution.

There are probably many other gotchas and areas to think about when designing multiplayer games, these are just a few that have come up for me. If you have other areas you think should be mentioned or want to discuss any of the above be sure to visit our [Discord](https://discord.gg/rune-devs). 
