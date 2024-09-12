---
title: Web Game Performance Optimization   
description: Tips and Tricks for optimizing web games on low end mobile devices 
slug: web-game-performance-optimization 
tags: [Game Development, Tip and Tricks] 
image: /img/blog/social-previews/web-game-performance-optimization.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Rune  
  url: https://www.linkedin.com/in/kevglass/
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Web Game Performance Optimization</title>
  <meta property="og:title" content="Web Game Performance Optimization"/>
</head>

Rune is a platform for publishing web games to millions of players, and we love every game that a developer builds on it. One of the more difficult parts about distributing web games is the number of types of devices the game will end up running on. If you are building web games for the desktop then performance is often not a factor. Web games tend towards being more simple visually than traditional desktop or console games and as such the super powered machines that most desktop players have don’t struggle with even non-optimized code. This is great for artistic and creative approaches to building games, developers can simply focus on making the game exactly the way they want it, in the easiest way for them. 

However, it’s different when you start considering mobile devices. Here at Rune we have a large player base which also means a huge variation in end user devices. If you’re trying to be inclusive and accessible in your game dev, which I know most of us are, you need to be making it possible for older devices to play your games (think developing nations and young people). Here’s some stats on the version of devices we see in our player base.

![](/img/blog/callouts/version-distribution.png)

What we see above fits with what I’ve seen in other environments too, iOS devices tend to keep up with versions - probably because of the Apple policy of pushing people hard to upgrade. Android however has a huge range of devices due to both the nature of the users wanting to keep their devices for a long time and the number of low budget models out there. The other thing to consider is that iOS devices on a later version nearly always have up to date powerful hardware as well. Apple doesn’t keep old operating systems running on old devices for too long. Android however has many low spec devices released that are still using the modern OS versions. 

Of course when you’re building games you’re always trying to balance the time it takes to optimize code against the number of potential players you’ll get. It’s all about time management. The data above and my own experience shows me that when you’re building web games and targeting mobile platforms the main pain point on performance is going to be Android. 

When it comes to multiplayer games the logic code at least will likely be running multiple times - attempting to rationalize the differences between the authoritative server state and local client state - so performance impact is compounded.

So, how do we address performance of games on a wide range of Android devices?

# Minimize Garbage Collection

The javascript runtime has come a long way, and specifically garbage collection (GC) is really really fast compared to some other languages (I’m looking at you Java). It has let us web devs get very used to creating temporary objects and replacing complete instances rather than updating fields in them - generally this leads to nicer code at least in my opinion.

However, regular GC in a game loop is the touch of death on low end Android devices. First, their runtimes might not be quite as far along as we’d like (see below). Second, efficient GC relies on having a fair amount of memory to play with - this is often not the case on lesser Android handsets. 

Consider where you can reuse objects instead of creating new ones.

# Old School Hackz

Back in the bad old days we had to optimize things by hand regularly. People did (and some still do) take great pride in spending a lot of time getting the tightest game loop possible. Today the profiler is your friend to find those bottlenecks, you can never assume anything, but some of the less well known from past are things are still issues on slow Android devices today.

## Example 1: Collision Checks

Many games perform a lot of simple collision checks between a large number of bodies. Often this is as simple as checking the distance between two points:

```Javascript
let dx = p1.x - p2.x;
let dy = p1.y - p2.y;
let totalRadius = p1.radius + p2.radius;

if (Math.sqrt((dx*dx)+(dy*dy)) < totalRadius) {
    // Collision
}
```

That `Math.sqrt` when used multiple times can really add up. So consider that we change the check to this instead:

```Javascript
let dx = p1.x - p2.x;
let dy = p1.y - p2.y;
let totatlRadius = p1.radius + p2.radius;

if ((dx*dx)+(dy*dy) < totalRadius * totalRadius) {
   // Collision
}
```

Same result, no `Math.sqrt`.

## Example 2: Angle Calculations

`Math.cos/sin/tan/atan2` are often used to work out movement and directions of entities in the game. Again, while these operations are so much faster than they used to be they can still end up being a bottleneck if used in the main game loop. One common gotcha is using an infinitely accurate value for the angle, so we end up computing `Math.cos(1.1)` and `Math.cos(1.10001)` preventing any sort of lookup optimization. 

So two things to consider

* Clamp your angles! Make sure your angles are only accurate to a fixed number of decimal places. Even better if you can get it down to 1 degree accuracy.
* Use a lookup table. Calculate all the trigonometry results you’ll need at startup and just index into an array to pick them up. If it was good enough for Wolfenstein 3D, it’s good enough for us! 

# Use WebGL (sometimes)

If you’re using a library then the chances are it's gone the WebGL route and implemented an efficient renderer for you. If you’re not and you’re going to write your own, be very careful. Writing a WebGL renderer that works really well on desktop and modern devices but fails dismally on older devices is all too easy. 

1. Make sure you know which extensions you’re using and why, and what will happen if they’re not available.
1. Keep your shaders short. Android devices with old or poor chipsets will struggle otherwise.

Another option is to look at HTML Canvas for rendering. Canvas used to be really slow and we all have scars, but it's been accelerated everywhere for quite some time. If you have the option and it makes sense for your game consider using Canvas instead. 

Anecdotally one of my games with a pretty well optimized WebGL renderer was outpaced by far by Firefox’s Canvas renderer on older Android devices! 

# Adapt Framerate

The obsession with 60fps or even 120fps is so important in desktop gaming, it’s an absolute expectation of players. As you move into web games on the mobile web it is easy to assume the same. Here’s a dirty secret, most mobile games don’t run at 60fps. Even if their refresh rate to the screen is 60, the actual redraws are much less. 

There are two ways to approach the framerate optimization:

* Just always run at 30fps - make the game feel right there and accept that on higher end devices you’re just saving them a lot of battery!
* Detect when the game is running at less than your target FPS and step it down. This is slightly harder to do because you don’t want tiny peaks and troughs of performance to impact the stepping.

One nice thing about the model Rune uses is that since the logic is always at a fixed framerate independent of rendering, changing the framerate is often very easy.

# Collision Detection and Physics

Collision Detection and Collision Resolution (physics) can be extremely complicated pieces of code. Optimally determining which entities need to be checked, whether they actually collide and what the resulting change is heavy on the CPU. 

If your game isn’t a pure physics simulator, e.g say a platformer or a shoot 'em up, consider writing a simple custom handler instead of using a full physics engine. 

# CPU and Network Throttling 

A feature that isn’t as obvious in Chrome Dev Tools is the CPU and network throttling. When you’re working on your game even on your desktop you can easily simulate a much slower processor and network connection using these options:

![](/img/blog/callouts/throttle.png)

Throttling down CPU in particular is a really good way to see how it’s going to feel on a old Android device. I generally work at 6x slower but 20x is more of match to the really low spec device.

# Android System WebView

Most of the time any web view in an application, like Rune, is going to make use of the [Android System WebView](https://play.google.com/store/apps/details?id=com.google.android.webview). On modern versions of Android this is essentially Chrome and performs really well. 

There are many versions of the Android operating system and particular devices where the Android System WebView can’t be upgraded so leaves your game running on something slower and more buggy. It's such a severe problem that in the Rune application we enforce a minimum web view version so developers don't have to worry about it.

If you’re hearing about performance issues on your web game and it’s on Android, get them to check the System WebView version.

# Testing

Final note. There is nothing like real device testing. The emulator gets you so far but if you can acquire an old device to test on its really worth experiencing how very different it can be. Ebay is a great place to start. I use a Samsung J2 which is definitely the worst device I’ve ever seen but it’s been invaluable in testing performance tuning.

Hopefully this blog is helpful to some web game developers out there. If you’d like to discuss more don’t hesitate to [hit me up on Discord](https://discord.gg/dusk-devs).
