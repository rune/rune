---
title: WebRTC vs. WebSockets for multiplayer games  
description: Why we're moving to WebRTC for multiplayer games
slug: webrtc-vs-websockets-for-multiplayer-games 
tags: [Game Development, Networking]
image: /img/blog/social-previews/webrtc-vs-websockets-for-multiplayer-games.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Rune  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>WebRTC vs. WebSockets for multiplayer games</title>
  <meta property="og:title" content="WebRTC vs. WebSockets for multiplayer games"/>
</head>

At Rune, we’ve got a platform where millions of users are now playing casual multiplayer games. As I [blogged about previously](https://developers.rune.ai/blog/modern-game-networking-models), we care a lot about making the multiplayer networking excellent. No matter which model you’re using, making the best use of the available internet transport is key.

![](/img/blog/social-previews/webrtc-vs-websockets-for-multiplayer-games.png)

When it comes to real-time games, the majority of modern releases use UDP rather than TCP. The web, however, for a long time only had access to TCP (via HTTP) and developers have found novel ways to make use of the reliable stream to build real-time games. However, the reason most real-time games outside of the web use UDP is its unreliable nature.

Why is unreliable good? 

Real-time games rely on prompt message delivery, or your ‘ping’ from a gamer’s point of view. With TCP and reliable delivery, if one packet gets delayed so does everything sent afterward. With UDP and unreliable delivery, packets aren’t dependent on each other so delays don’t compound. This does leave the developer working out which packets/data need to be reliable and how to ensure it, but the finer level of control gives options for a better game experience.

As I said above, the web used to be TCP only, but with the advent of WebRTC, and a few years after its initial release, we were given [RTC Data Channel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel) which, while not pure UDP, can act like it. 

## What are WebSockets?

WebSockets have been with us since about 2008. They were the first game development-usable two-way communication available in the browser. Before this, we had server-side pushes and some polling technologies, but the response time was high. 

When a browser retrieves pages, it connects out to the server, requests the page, and gets a response. Browsers generally reuse their connections, so the TCP connection was staying open to the server for subsequent requests. The server, however, can’t send anything with HTTP unless a request has been received that it's going to respond to.

Enter WebSockets and the 101 Upgrade / Switching Protocols messages. Since the TCP connection is staying up anyway, can’t we just leave it there but let the server and client exchange data (or frames) as and when they want?

![](/img/blog/callouts/websocket.png)

Now we have two-way communication between the client and server, and this works well for certain types of games. However, the connection is still TCP, which isn’t great as I’ll describe in more detail below.

The great thing about WebSockets is how easy it is to implement on both client and server. There are a wide range of libraries easing the development of WebSockets, most notably [Socket.io](https://socket.io/), and the amazing availability of cheap hosting for them.

## What is WebRTC and Data Channel?

WebRTC is a technology to allow voice and video communications directly in the browser. It arrived around 2011, got formalized, and was widely supported by 2015. As part of the specification, the [RTC Data Channel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel) was added. Data Channel provides a real-time method to send raw data between browsers and servers, or “peers” in WebRTC language. 

Since WebRTC originated from the voice/video world, when they added data channels, they used a telecoms-based protocol called SCTP. Luckily, SCTP is based on UDP and it can be configured to act like raw UDP, i.e., send a packet once when I tell you to.

WebRTC is considerably more complicated to work with than WebSockets. The initial setup of the data channel requires the peers to exchange signaling information (SDP, a text payload). This means you’ll need some other transport (normally WebSocket) to pass the signaling before you can even get a channel set up.

Since the final connection is using UDP, network traversal can also be more complicated. Again, WebRTC used the telecom standards for determining the best path through a network to connect peers using STUN, ICE, and TURN. 

* STUN to determine your own address
* ICE to describe possible ways to connect
* TURN as a relay when other connection methods can’t work. 

The infrastructure you need to run WebRTC is more intricate although there are now free and inexpensive cloud services available.

![](/img/blog/callouts/datachannel.png)

Library support is also limited with respect to WebRTC, with the majority of the few libraries available focusing on the voice/video side of the API rather than the data channel that we’d like for game use. There are some great examples like [node-datachannel](https://github.com/murat-dogan/node-datachannel) that are becoming mature enough to use in production services along with great cloud services like [livekit.io](https://livekit.io/).

## Head of Line Blocking

So, given that WebRTC is harder to use and develop with, why would we use it? 

As mentioned above, there’s a significant difference between TCP and UDP that matters for real-time games, [Head of Line Blocking](https://gafferongames.com/post/client_server_connection/).

TCP attempts to fully manage the connection between endpoints for you. This includes resending packets for reliability if the far end has not acknowledged them, windowing to make sure we’re not attempting to send “too much” and congestion control to detect when the network can’t handle what's waiting. This is great for general connections - the internet is a difficult place to work in and managing the connection like this takes a lot of work off the developer.

However, for real-time games, every millisecond counts and having TCP ensuring order and delivery for every packet often gets in the way. As the Gaffer article above describes, if one packet on a TCP connection doesn’t get through then every other packet is now waiting for the first’s delivery and the developer can’t access any of the data (that may have already arrived) until that first packet completes its journey.

In short, if you’re wanting to do real-time communications, you need UDP, and in the current web browser, that means WebRTC. 

Is it worth the work? Yes.

## The Future

Of course, with all things web, there’s a new standard coming that might shake things up again, [WebTransport](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport). This new standard looks like it’s going to give us game developers everything we might want. 

Unfortunately, at the time of writing, the standard is still changing, browsers aren’t quite there yet, and the server-side support is very limited. 

I’m still holding out hope that WebTransport is the answer, but what do you think? 

If you’re interested in this topic or the Rune platform, drop by our [Discord](https://discord.gg/dusk-devs) and let us know.