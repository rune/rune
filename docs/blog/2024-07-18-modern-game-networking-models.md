---
title: Modern Game Networking Models  
description: A selection of networking models discussed in context of modern games.
slug: modern-game-networking-models
tags: [Game Development, Networking]
image: /img/blog/social-previews/modern-game-networking-models.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Dusk  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Modern Game Networking Models</title>
  <meta property="og:title" content="Modern Game Networking Models"/>
</head>

At Dusk we’re building a place where developers can share their multiplayer web games with the world. This of course means we care a lot about game networking code and how it performs in the real internet at scale. 

Networking in games isn’t easy, you’re dealing with a conflict between the speed of light, the distances between people playing on the internet and player’s expectations. Worse still a player’s emotional state, i.e. whether they win or lose, can often be dependent on the networking model that’s been used and whether it seems “fair”.

![](/img/blog/social-previews/modern-game-networking-models.png)

There are several types of game networking models used in modern games. Normally when you’re planning out a network game you’ve got to consider:

* **Latency for the Player** - or “how does it feel?”. Will players still feel attached to their characters or units? If there’s noticeable latency between controls and action, can it be explained away in some game fitting way?
* **Available Bandwidth and Battery** - some network models can have high network usage and can be expensive on battery (as well as bandwidth). Can your expected player base absorb that?
* **Is it difficult to implement?** - We often try to aim for the most simple solution, assuming that the differences between the average and optimal solutions won’t matter. That’s not the case in network code. Is a simple model good enough?
* **What happens when the network goes wrong?** The internet isn’t consistent. Across all the different connections you’ll see a lot of variance in latency and constraints. More annoyingly, you may see a large variance in a single connection. A great connection may still have lag spikes at 5x the average latency. What happens in your network model when there is a lag spike?

That fourth one is really painful. It’s extremely difficult to test properly meaning you’ll most likely only find out there are issues once the code is out in the wild. Game networking is a lot like video conferencing - if there’s a problem your users will just know. They’ll detect even tiny corner cases and it’ll distract from their experience. 

The internet has constraints that make it hard to predict what it’ll look like when you try to play a game:

* **Packet Size** - We’re all very used to being able to download large files. Libraries often abstract developers from the underlying transport and allow them to send whatever they want. However, the actual packets that run across the network have a fixed size (about 1500 bytes - MTU) so if you care about latency you need to be thinking in the packet model.
* **Physical Constraints** - The internet is fast, but its not *that* fast. Let’s assume there was one fiber line around the world. A packet, even at light speed through fiber would still take ~200ms to travel around the world. Now add in routers and switches on that path, and remember that most of the internet isn’t fiber. Don’t forget the last hop to the end user device. This tells us it’s important to think about regional servers (outside of any network model). 
* **End User Devices** - There are a great variety of devices on the internet. Mobile games (where Dusk targets) can have a wide spectrum of device power and connection availability especially in emerging markets. The game of course still needs to feel fair.
* **Congestion and Loss** - The internet is a shared resource. Most of the time this doesn’t matter, most routes and backbones are hugely under subscribed. When congestion does become an issue the internet has one solution - drop low priority packets (that means yours). 

It’s pretty clear it’s a hard nut to crack but of course we do see many successful internet playable games. Clearly there are network models that work. Let’s look at a (non-exhaustive) list.

## Turn Based

Some games don’t need real time network or for that matter low latency controls. If the game is either actually turn based - or can be treated as turn based - we can use a simple authoritative server and message passing. 

Player 1 takes their turn. They send a message describing their actions to all the other players via the server (or peer to peer). Each receiving player (and the original player) plays out those actions in their game state. The next player then takes their turn and so on. If needed the server can also take a turn to move the computer controlled elements. Games like X-COM did this with great success. With additional rules like overwatch, the game still felt dynamic and fun but the networking didn’t need to have any pressure at all.

There’s a couple of caveats here. 

1. The players must start from the same game state.
1. The application of the actions must be deterministic, that is playing out the actions must result in the same state on all instances of the game logic.
1. If a player joins mid-game you still need to be able to serialize the complete game state and pass to them.
1. If a player lags then all the other players get to wait too. 

Huge pro on this one, it’s really easy to implement!

## Brute Force

Some of the early real time shooters out there did networking but they didn’t obsess over the details of making it “fair”. If your players can cope with accepting what they saw was wrong and they died anyway then you can skip trying to be clever.

The approach was simply to spam the network with packets describing where you said you were and what you said you were doing. The server would accept what you said as fact and try to resolve any interactions within a set of rules. e.g. if A says he shot B and they are close enough then he must have, tell B to take the damage and die.

Surprisingly the games were still fun and players weren’t screaming about it being unfair. They simply didn’t know anything better and just accepted lag deaths. In most cases the rules on the server would be good enough to make things seem ok and players enjoyed the games - until the event of unofficial modding of clients.

As soon as you’re trusting clients you’re in a dangerous place where a nefarious player can modify their games to let them cheat by just keeping within the bounds of the server rules. Games makers went back and forth with the cheaters trying to implement more and more complex rules to prevent the modified clients from working. Of course there were only a few devs and 1000s of players so it was a losing battle. 

## Lock-Step

In lock step all the clients in the game are peers of each other. They all run their own copy of the game logic. Each frame the client sends the player’s current inputs to all the other clients. Clients only move the game forward once they’ve received the inputs from all players for any given frame - since it’s only then they know they have enough information to work out what needs to be shown. 

This worked very well on local networks but became more painful on the internet. In the lock step model if one player is lagging - all of the players lag since they need to wait for a step from that player. 

Again, since the clients were being trusted, games were open to cheating. This didn’t stop some games being very successful using the model. Traditional RTS games (like Starcraft) used the model along with some older shooters like Doom 1.

In the RTS/Click-To-Move games the lock-step model works particularly well, since players expect a certain delay between telling a unit to move or act. This delay period can be used as a buffer for any lag between peers. Diablo 1 used this approach, and found a really interesting bit of information out about players. Players didn’t hate the delay as long as it was the same delay every time. Diablo actively managed the delay between the player’s click and response by moving the delay window until it could remain constant. 

## Delayed Action

Another common network model is delayed action. In this model each player runs a copy of the game logic / state. When a player takes an action it’s sent to the server for scheduling. The server game logic is ticking along, when it receives an action from a player it schedules it in its game logic and notifies the clients (including the client it receives it from). Each of the clients schedules the action at the time the server has determined. The client and servers copies of the logic execute the action and then the results get played back. 

It feels a bit like turn based, but the server time step is always moving forward. Two players can take actions at the same time and the server will schedule them deterministically on all clients. 

Sounds great, but there are few issues:

* Client game states can’t move forward any faster than the server, so the client is waiting on a tick message from the server. If there's a lag spike client’s feel it immediately. Clients generally run along behind the server for a few frames to give a buffer should a spike happen.
* There’s a latency between when the player pressed the button to move the unit and it actually moving since the message has to get from client to server and back again before being executed. Since clients are generally running a bit behind this latency can be larger than just the network delay. 
* If the client gets a lag spike it might well get behind by a significant amount since it’s waiting on ticks from the server. A client will then get a whole series of packets in one go causing it to have to speed up. Games do this very subtly in the hope players don’t notice. 
* Game logic has to be deterministic such that when actions are applied on all clients they end up with the same state. 

## Predict-Rollback

Many modern games use the Predict-Rollback model which tries to balance low latency client controls with authoritative servers that prevent cheating. 

In this model clients and a central server keep a copy of the game state. Each client is running ahead at its own rate trying to stay somewhere close to server time. When a player takes an action the client schedules locally at a time based on its local measurement of the delay to the server. 

It then sends the action to the server which schedules it at the same time the client decides - assuming that it's not in the server’s past. The server passes the action out to all clients with the scheduled time. Since we’ve accounted for server delay in the scheduling in many cases all the clients and the server apply the action at the same point in game logic and everything stays in sync.

The client is *predicting* what the outcome of its action will be and letting the player continue on the assumption it’s correct. 

So where does the rollback happen? There are a couple of cases:

1. If the time that the client wanted to schedule the action at was in the past for the server, then the action needs to be rescheduled at a different time in the server’s future. All clients will be told the new time (including the original sender)
1. If the client that’s predicting the outcome of the local actions receives an action from another client that’s in its past. This may make its game state prediction incorrect.

When these cases happen the clients have to *rollback* their game state to point before the incorrect or new action happened. Then play forward again the actions until the current time - thereby getting to the correctly synchronized game state. The clients then continue from that point predicting the outcomes of player actions.

Some implementations have rollback functions that are “anti-actions” - in that they undo whatever the action would have done. Others keep a copy of the last known valid server state on the client by maintaining two copies of the game state. 

Predict-Rollback is great because for many cases the prediction is accurate and the player gets very responsive controls. It also supports an authoritative server without stopping clients that are doing the right thing from moving forward. Lag is limited to the player with the bad connection.

Tricky bits with this model:

* It’s hard to implement. It’s a complex model that requires engineering to get right.
* When there’s a conflict and a rollback occurs there’s a spike in CPU that needs to be managed carefully. 
* Rollbacks that cause significant change need to be managed by the game rendering - hiding issues and making things seem natural.

All that being said, the pros of quick input response time, low bandwidth and conflict resolution mean this is becoming more and more the standard approach to game networking.

## Summary

As you can see there are different ways to make game networking work, and as you can tell from the games mentioned people have been trying to solve it for decades. 

At Dusk we implement predict-rollback, it’s complicated to implement but the bright side is you don’t have to, it’s just part of the platform. If you want to learn more about how to implement a multiplayer game on Dusk, [check out our examples](/docs/examples/games), [tech demos](/docs/examples/tech-demos) and [documentation](/docs/quick-start) - or [join our Discord](https://discord.gg/dusk-devs).
