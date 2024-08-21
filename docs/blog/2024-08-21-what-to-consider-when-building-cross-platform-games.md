---
title: What to consider when building cross-platform games
description: Considerations for building cross platform mobile games
slug: what-to-consider-when-building-cross-platform-games
tags: [Game Development]
image: /img/blog/social-previews/what-to-consider-when-building-cross-platform-games.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Dusk  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>What to consider when building cross-platform games</title>
  <meta property="og:title" content="What to consider when building cross-platform games"/>
</head>

At Dusk, we’ve got a platform that lets developers get their games out to millions of players on mobile devices across the world. With that number of players, you can imagine the device range is also wide. While Dusk abstracts a lot of this complexity away, there are still a few things developers need to consider.

## Cross-Platform Design

The most obvious area is the design of the visuals and fitting it to the various screen sizes out there. The range of screen sizes is shown below along with the different approaches you can take to deal with them.

### Tiny UI

Probably the easiest approach is to simply make your UI tiny or limited in such a way that it’ll fit on any screen. This is often the most effective game visual design approach since it also encourages you to limit what's going on in terms of user interface - which leads to less reading, which is something the audience wants.

If you design for 360x600, you’re likely to be fine in 99% of cases. However, this does limit your creativity to this reasonably confined space. It also means players with larger screens won’t feel the benefit.

### Responsive

With responsive design, the developer creates a UI that responds to the screen size available. This is very common in web and app design, but not so much in game design. A responsive design takes some thinking about; elements of the UI and game interface are described in terms of their proportion to each other. So, maybe the logo is 25% of the height of the screen and the start button is 10% – no matter the size of the screen, those elements will fill 30% of it.

For games, this can be hard since the elements of a game UI are often extremely richly styled – themed to fit the game. Unlike traditional web and mobile applications where the UI is reasonably simple, in an RPG the UI might be built out of intricate gold edging with scrolls filling in the background with complex textures. Making this scale up and down for different screen sizes automatically can be difficult. 

### Custom

For those developers with the time and inclination, we have the custom approach, and surprisingly, where many commercial games end up. The developer creates a code base that has different layouts and assets for different scenarios. Most common is the tablet/mobile split, where depending on the device, the UI is significantly different. However, this same approach can be applied to pure phone sizes by categorizing them:

* nHD - around 640x360 pixels,
* qHD - around 960x540 pixels
* HD - around 1280x720 pixels
* HD+ - around 1600x900 pixels

This gives us fixed targets for the custom code to work against. Pick the lowest one that’s less than or equal to the actual resolution and use that layout code.

## Performance Characteristics

Here are some of the top devices and their specifications taken from over 10 million recorded devices on the Dusk platform.

| Vendor | Model | CPU | GPU |
| ----- | --------- | ------------------- | -------- |
| Redmi | M2006C3LG | Octa-core (4x2.0 GHz Cortex-A53 & 4x1.5 GHz Cortex-A53) | PowerVR GE8320 |
| Samsung | SM-A107M | Octa-core 2.0 GHz Cortex-A53 | PowerVR GE8320 |
| Redmi | M2004J19C | Octa-core (2x2.0 GHz Cortex-A75 & 6x1.8 GHz Cortex-A55) | Mali-G52 MC2 |
| Redmi | M2006C3MNG | Octa-core (4x2.3 GHz Cortex-A53 & 4x1.8 GHz Cortex-A53) | PowerVR GE8320 |
| Samsung | SM-G532M | Quad-core 1.4 GHz Cortex-A53 | Mali-T720MP2 |
| Apple | IPhone 7 | Quad-core 2.34 GHz (2x Hurricane + 2x Zephyr) | PowerVR Series7XT Plus (six-core graphics) |
| Samsung | SM-G610M | Octa-core 1.6 GHz Cortex-A53 | Mali-T830 MP1 |
| Redmi | M2003J15SC | Octa-core (2x2.0 GHz Cortex-A75 & 6x1.8 GHz Cortex-A55) | Mali-G52 MC2 |
| Samsung | SM-A015M | Octa-core (4x1.95 GHz Cortex-A53 & 4x1.45 GHz Cortex A53) | Adreno 505 |
| Apple | IPhone 11 | Hexa-core (2x2.65 GHz Lightning + 4x1.8 GHz Thunder) | Apple GPU (4-core graphics) |

Even just looking at the top 10 or so, we can see a reasonably wide range of available hardware. 

### CPU

Mobile CPUs are getting faster all the time, but there are still plenty of low-specification devices out there. You also have to consider that the device will be running other applications at the same time as your game and if you’re using Dusk, it’ll be used for a voice call as well. 

It’s best to avoid CPU intensive loops making, sure your code does this in small sections over multiple rendering frames rather than attempting to process a lot of data in one go.

The pauses caused by CPU operations being locked up with a tight loop are the number one cause of player abandonment. That crazy button mashing when your phone seems to have stopped responding, resulting in the app/game eventually coming back but immediately closing. Users don’t like the feeling of their phone not working and so rarely open the application a second time to give it another chance.

### GPU

Graphics chip usage is one of the most common causes of a very good game failing to spread across the mobile universe. Mobile graphics performance varies a great deal even from devices over the last 5 years. Your beautiful 3D game isn’t going to be so interesting for a player who is seeing it at one frame every three seconds while holding a phone that’s melting in their hand.

Keep it simple, especially 3D. Low-poly models don’t have to mean ugly. Multi-pass rendering should be used sparingly – a shadow pass is normally enough to make it feel real. 

Also, it’s worth keeping in mind that the final game is going to be played on a 6.5-inch device; what you see on your monitor where it’s scaled up isn’t what will be visible to someone looking down at a tiny device. Avoid obsessing over the tiny detail you can see that no player ever will.

## Physical Properties 

One aspect that’s often overlooked with cross device games design is the physical aspects of the different devices.

First, we have the physical size of the design, especially when you’re thinking of two-handed controls on portrait games. What feels nice proportionally on a large device (8 inches or more) will often be uncomfortable to hold on a smaller device (around 6 inches). It’s worth finding items of the right size to test the feel of the controls (I use cardboard, cut and measured).

Second, “notches” – oh, how we hate them! Ever since the iPhone introduced the camera notch, web and game designers have despaired. Different devices now have different notches and notch sizes, meaning developers need to consider what’s called the “safe area.” As a game designer, of course, you want to fill the screen with the assets, so you both have to account for the notches but also avoid putting anything important there.

Luckily, if you’re writing games on Dusk, it handles the safe area/notches for you leaving you with a clean rectangular area in which to put your game!

Making your game work well cross-platform and cross-device increases the number of potential players you have access to. In multiplayer games, it’s also key to make sure the experience is as similar as possible across devices to keep the game feeling “fair”.

If you have any questions or have anything to add, come join us on Discord. 


