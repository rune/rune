---
title: Hasn’t everyone got a good phone nowadays?
description: Types of devices you're building for on Rune
slug: hasnt-everyone-got-a-good-phone-nowadays
tags: [Game Development]
image: /img/blog/social-previews/hasnt-everyone-got-a-good-phone-nowadays.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Rune  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Hasn’t everyone got a good phone nowadays?</title>
  <meta property="og:title" content="Hasn’t everyone got a good phone nowadays?"/>
</head>

When you’re building any client software, it’s useful to know what types of hardware your end users have – doubly so with experience-centric software like games. For the types of games I like to build, even the lowest-end desktop hardware has been more than enough for many years. However, for mobile game platforms like Rune, the types and power of devices that end users have can dramatically affect the player experience. 

In this article, we’ll look at the types of devices and their capabilities found in the Rune user base. We’ve taken the top 30 most popular mobile devices on Rune (accounting for about 2 million users) and broken the data down by processor, GPU, screen size, memory, and release date.. As you can see below, in mobile game development, there’s still a huge range of capabilities to account for.

## Screen Size

![](/img/blog/graphs/ScreenRes1.png)

The graph above shows the screen resolutions in [device-independent pixels](https://en.wikipedia.org/wiki/Device-independent_pixel). There’s a huge variety of screen sizes in use, going all the way down to significant numbers (40k) of users with screens as low as 375x667. Likewise, the top end has over 50k users with 2399x4973 screens. Responsive design is key.
 
## Memory

![](/img/blog/graphs/Memory.png)

The spread of onboard memory is also wide, going as low as a single GB. The top end is quite low compared to very modern devices, maxing out at 8 GB. This, of course, is only in the top 30 devices in a much bigger user base, but it gives you an idea of what the games need to run on.

## Processor and Graphics

The following charts show the spread of CPUs and GPUs on the devices playing your games today.

### Processor

![](/img/blog/graphs/CPU.png)

### Graphics

![](/img/blog/graphs/GPU.png)

Analyzing the graphs above, we can see there are essentially two types of devices being used:
 
* Octa-core CPU, Mali/PowerVR GPU class devices. These are reasonably powerful and will cope with most Rune games very well.
* Quad-core CPU, Adreno GPU class devices. These are the budget devices that we see so many in Gen Z having due to the lower cost. These are the ones that you need to target to get maximum playtime for your games.
 
## Release Year

One final piece of information: the release year of the devices in the top 30.

![](/img/blog/graphs/Release.png)

This explains the other data: the majority of devices in the top 30 are 4–5 years old.

Hopefully, the data here will help focus and tailor your game development efforts to get the maximum playtime from our player base.

Does this align with what you’ve seen? Want to know more? Why not drop by the [Discord](https://discord.gg/dusk-devs) and have a chat?


