---
title: New Updates! April 2025
description: Release notes for the Rune platform 
slug: release-notes-april-2025
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
  <title>New Updates! April 2025</title>
  <meta property="og:title" content="New Updates! April 2025"/>
</head>

## 🛠️ App Improvements

* Enhanced the login screen to display the invited realm when the app is opened from a realm invite link 🌐📨 
* 🤝 Improved onboarding from a friend link—new users auto-add their friend when creating a realm, and existing users see a fresh splash screen. 
* 🗣️⏱️ Deployed new room card variations in realms and DMs to clearly show who’s in the room and how long they’ve been talking! 
* Made the delete account screen more compact and styled it to support auto graphic resizing, while removing scroll to better support accessibility settings. 
* Updated the leave group button to appear disabled for group owners, with an alert explaining why they can’t leave if clicked 🚫👑 
* Refreshed the join room and join realm buttons with a bold new look to align with our current designs ✨
* Officially rolled out the use of “realms” across the app, instead of “groups”!
* 🏁 Introduced default realm names during onboarding to make getting started even easier! 
* 💬🌟 Refreshed the Friends tab to be “Chats” with updated styling and a clearer “No Friends” prompt to create a realm!

## 🪲 Bug Fixes

* Fixed spacing between room cards in the room list to tighten up the layout and remove excess gaps 📏
* Polished onboarding with fixes for realm creation prompts, alerts for friend links while in rooms, and smoother swipe-back from realm chat 🎯 
* Implemented several fixes, including QR screen titles, improved layout for editing realm names, better realm link navigation, and support for long realm names in details.
* Adjusted room card avatar styling to prevent crowding when many users are in the room 👥
* Fixed stories and bottom sheet avatar functionality so now tapping correctly opens the user’s profile page!
* Prevented an app crash by adding safeguards to unprotected route references in the code.
* Removed multiple navigation calls and switched to a different history reset method to help prevent another app crash 🔄📱
* Enabled automatic refreshing of groupmates when users are added, removed, or join, ensuring the most up-to-date room info.
* Fixed a cold boot issue where push notification taps didn’t work due to a login state bug—now handled correctly when already signed in 🔔
