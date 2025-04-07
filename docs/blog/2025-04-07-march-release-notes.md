---
title: New Updates! March 2025
description: Release notes for the Rune platform 
slug: release-notes-march-2025
tags: [Release Notes]
image: /img/blog/social-previews/rune.png
authors:
- name: Amani Albrecht
  title: Chief of Staff at Rune  
  url: https://www.linkedin.com/in/amanialbrecht
  image_url: /img/blog/people/amani-albrecht.png
  hide_table_of_contents: true
---

<head>
  <title>New Updates! March 2025</title>
  <meta property="og:title" content="New Updates! March 2025"/>
</head>

## 🛠️ App Improvements

* 🗂️🎙️ Unveiled one of Rune’s biggest upgrades—rooms can now be minimized, so you can explore the app while staying in voice or game chat! 
* Redesigned the group member invite flow with a cleaner share section and simpler UI—making it way easier to add friends which drove a big spike in usage 🚀👥 
* 🔍 Added smart friend suggestions to the group add members screen, complete with a red badge for visibility and a new full-screen search experience. 
* Launched a new Group Details header—admins can now edit the name and emoji directly, complete with new call/play buttons, member suggestions and cleaner admin tools! 📝 
* Improved handling of ending realm calls early when the caller leaves by using updated room state to exit cleanly if no one has accepted yet 📞👤
* Switched to a new user status system with smarter, screen-specific pollers and push updates— keeping presence info and joinable room data accurate and up to date 💬

## 🪲Bug Fixes

* Polished up the minimized rooms release by fixing orientation flips on Android and smoothing out mute button behavior 🔧
* Disabled experimental layout animations on Android to help prevent an app crash, then reenabled when it didn’t seem to decrease crash rate 📱
* Prevented layout animations for react-native-screens on Android to prevent app crashes 🚫 
* Deactivated the back button inside rooms to prevent issues with minimizing rooms! 🔒
* Resolved an issue where the mute button was incorrectly disabled by resetting its logic at the start and end of rooms 🎤🔁 
* 👾 Addressed a race condition causing gremlins if a new token was requested right after logout and the user logged in again immediately! 
* Turned off RTL (right-to-left) support to help reduce crashes tied to orientation changes in React Native. 
* 🧼 Polished the group details screen with better spacing, member counts in the header, and clearer Add Members search results!
* Added a missed translation for the "Owner" group status on the Add Groupmate screen to improve clarity across languages 🌍 
* Made layout tweaks to the Group Detail screen—added a crown icon for the group owner and centered names when there's no subtitle 👑📐
* Adjusted app user row layout to center properly and use consistent group status translations 🧩
* Consolidated joinable room icons across the friends list and members pane—now you’ll just see one clean, unified tile when a room is joinable 🎮 
* 🔓 Fixed an issue where unlocking a room cleared other users’ room info in stories and the member pane—now only the correct room gets updated!
* Fixed Realm-Call notifications to show correct user names by waiting for language to load and removing localization 🗣️
* Handled a null object case to prevent a long-standing crash related to voice chat messages 🎙️🛡️
* Prevented navigation to messages after being unfriended by updating the member pane popup to properly handle removed friends. 
* 🎯👆 Fixed the add members icon so tapping it now works as expected—no more dead button! 
* Made the entire delete account screen scrollable so everything stays readable on shorter devices.
