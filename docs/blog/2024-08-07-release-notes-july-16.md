---
title: Release Notes July 16th - 31st 2024
description: Release notes for the Rune platform 
slug: release-notes-july-16
tags: [Release Notes]
image: /img/blog/social-previews/dusk.png
authors:
- name: Amani Albrecht
  title: Chief of Staff at Rune  
  url: https://www.linkedin.com/in/amanialbrecht
  image_url: /img/blog/people/amani-albrecht.png
  hide_table_of_contents: true
---

<head>
  <title>Release Notes July 16th - 31st 2024</title>
  <meta property="og:title" content="Release Notes July 16th - 31st 2024"/>
</head>

## 🛠️ App Improvements

* More profile improvements like adding explainer text for the "Top Developer" badge and in-room profiles! 👀  
* 🌐 Added the ability to change your language and country directly in the new and improved profile screen!   
* Enhanced our expo update logic on Android, now it’ll download automatically without user feedback and wait to apply until the next app restart 🚀
* Removed the Preview button from the avatar editor, as avatars now update lightning-fast when you choose new cosmetic options. 
* Upgraded scrolling performance in the profile interest picker and enable bouncing scroll everywhere so the app is more responsive 📜

## 🪲Bug Fixes

* Fixed a visual bug where games with long names were overlapping the # of players section on the game details screen 👥
* Rectified a visual issue where avatar customization options appeared square instead of round on Android 7.  
* Sorted out an unexpected audio switch from speaker to earpiece when a new roommate joins your room on iOS devices.  
* Busted two bugs where the splash screen was flashing white briefly beforehand and showing after they exited a room if they booted the app into an incoming call.  
* Lots of perfecting how the avatar background colors and profile screen look inside the app 🎨  

## 💻 SDK Improvements
 
 * 🚀 Added ESLint and Vite plugins to the SDK package, simplifying code setup! 
 * Spruced up our example game dev UI so it is more responsive to layout changes ✨ 
 * Introduced checks for newer SDK versions on dev/build commands, ensuring you all have the most up-to-date tools! ⚒️
 * Integrated updated avatar assets into the SDK, so many options for customization! 🛠
 * Updated the dev UI for better screen fit across all phones, especially in landscape mode. 
 * Improved dev UI logic so now you can’t remove players from the UI while it’s loading. 
 * Refurbished the SDK network detection logic to better handle CSS! 
 * Fixed a possible state desync that was happening on player leaving. 
 * Upgraded our error messages in the SDK to be clearer and introduced logging of error stack traces to enhance troubleshooting and debugging 📊 
 * 🎯 Rebuilt the interpolators to independently maintain speed and targets for each axis, enhancing precision and control! 