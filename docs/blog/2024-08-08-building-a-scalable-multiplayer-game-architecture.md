---
title: Building a Scalable Multiplayer Game Architecture
description: Components of multiplayer game architecture
slug: building-a-scalable-multiplayer-game-architecture
tags: [Game Development, Networking]
image: /img/blog/social-previews/building-a-scalable-multiplayer-game-architecture.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Rune  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Building a Scalable Multiplayer Game Architecture</title>
  <meta property="og:title" content="Building a Scalable Multiplayer Game Architecture"/>
</head>

I’ve built a few game servers over my career, including session-based mini games and an MMORPG. At Rune, that experience comes in handy as we’re building a game architecture that needs to support 10 million players. Getting the architecture right is key to having something scale in the long term.

![](/img/blog//callouts/scalable.png)

There are lots of resources around the web on game server architecture, but it’s also worth noting that the requirements for gaming are very similar to voice/video conferencing (maybe that’s why WebRTC fits so well?) - so it’s worth checking out the architectural approaches there too.

The following are some of the issues and requirements to consider when building your own scalable multiplayer game architecture.

## Matchmaker vs. Real-Time

Most games have some form of matchmaking, or working out the best pairing of players. Some games also have social and configuration type activities that don’t require player-to-player interaction. These are normally categorized as “matchmaking.” The requirements on latency in these scenarios are reasonably low. If a player is choosing a map or finding another set of players to compete with, a second or more response time is acceptable.

Once the players actually start playing the game, they immediately have a different set of requirements. In the “real-time” phase, player latency changes the game experience dramatically. It’s important that we’re optimizing for low latency on the network and high throughput on the server activities. 

Since there are two different sets of requirements, it’s good practice to split these two scenarios into different components in the architecture. In the diagram above, we have the split between the central server - responsible for our matching type activities, and the real-time regional servers used for relaying in-game messages.

## Regional Servers

As mentioned in [Modern Game Networking Models](https://developers.rune.ai/blog/modern-game-networking-models), one of the first things to think about in any networked game is making sure that the connection between client and server is the best it can be. 

Even if you assume everyone is on a great connection (something that isn’t true!), in the best case, network packets travel at the speed of light. If players are connecting from anywhere in the world, then the distances between a central server and the clients add up to significant latency.

To solve this, it’s ideal to introduce regional servers, that is, servers that are closer to clients. This limits the distance the packets have to travel and hence lowers the latency. 

The downsides here are that running lots of servers is costly, and of course, if players want to play together from very distant locations, you have to choose one region for them to play on that might not be optimal for them.

Where players are a long distance from each other you have essentially two options:

1. Pick a regional server that’s equally distant from both. This ensures they both get a similar network experience - although not optimal for either.
2. Rely on backbone trunking. Connecting across the public internet can be slow for lots of reasons (e.g., poor cell/wifi, lots of network hops). The backbone fabric that your servers run on is often much faster. We can choose to have the players access a local regional server as an access point and then connect these regions via the faster backbone. 

## Load Balancing 

Any scalable system needs to be able to add capacity through adding servers and this means load balancing. The split between matchmaking and real-time also changes how we do load balancing.

On the central server, the load balancing can act largely like a web application, that is, load balancing can be stateless and we rely on the database as the synchronization layer. If a player applies a change to their skin, the application can make a change, store it in the database and on the next invocation read it back from the database. There’s no running state that needs to be maintained between invocations.

However, on the real-time server, there will be several pieces of state:

* The connections from the players themselves. As mentioned in [WebRTC vs WebSocket](https://developers.rune.ai/blog/webrtc-vs-websockets-for-multiplayer-games), for high performance we want to establish and maintain a connection between clients and the real-time server. The connection must not be dropped between interactions with the server.
* The server is running the authoritative part of the game, making sure that the players see the same state and don’t cheat. The server may also be running part of the game logic such as computer-controlled actors and in-game events. This needs to continue to run whether players are taking actions or not.

Since the real-time server is stateful, the load balancing needs to connect to the same server for all players in the same session. In an MMORPG this means the zones the players are allocated to a server and all players in those zones connect to that server. In Rune, this means that the room/game combination is allocated to a server in the same way.

More generically in load balancing, this is known as “sticky sessions.” When a connection is made to the load balancer an attribute/parameter of the connection is used to determine where the connection needs to go. This of course makes the load balancer that bit more complicated and often leads to custom load balancing solutions.

## Database 

For most online games, databases are key to maintaining the long running state and storing player profiles, levels etc. The central server uses the database to maintain state between invocations so it’s heavily used and operations often rely on results from the database. This behavior is common in web application architectures too and means being very careful with your database performance.

On the other hand, the real-time server use of a database cannot block operations. Real-time exchanges are measured in millisecond latency and any blocking based on a database is likely to degrade player experience. On the real-time server it’s generally preferred to avoid any database read access in the core network flows - instead pulling the data required at the start of the session and holding it in memory. 

There are of course cases where actions in the real-time server where the database needs to be updated to reflect changes the player has made. Whenever possible keeping these interactions asynchronous is the best approach. 

The matchmaking and real-time servers should have a separate database (or at least a different set of tables/schema) that they act on. This allows us to have different rules of engagement to the database in each case and to be able to tune the database in each scenario for its specific expected use.

The final point of database interaction is where the updates on the real-time server need to be passed back to the central server, or vice versa. Again, whenever possible this needs to be an asynchronous process so that it doesn’t interfere with the real-time server run-time operations.

## Metrics

Final, but important, point: don’t forget metrics/observability. When scaling any system it’s key to be able to understand how the system is operating and even more how any change that you make affects the performance and stability.

Applying metrics after the fact is actually pretty hard, trying to instrument or interpret database everything once it’s all in place and the implementation has passed is time consuming and error prone. 

When building a scalable system design and add the metrics to the features as they’re implemented. Having well-thought-out and intentional metrics is the only way to really tune and improve an architecture.

If you found this article interesting or have questions, drop by the [Discord](https://discord.gg/rune-devs).
