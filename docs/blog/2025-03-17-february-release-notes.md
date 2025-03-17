---
title: New Updates! February 2025
description: Release notes for the Rune platform 
slug: release-notes-february
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
  <title>New Updates! February 2025</title>
  <meta property="og:title" content="New Updates! February 2025"/>
</head>

## 🛠️ App Improvements

* 🔄🎭 Updated the group avatar change screen to match the user avatar flow by adding a back button, removing save/cancel buttons, and showing a save prompt when changes are made!
* Tweaked the game details screen by simplifying the header, moving the large graphic into the scrollable body, and hiding buttons from the details body in realms.
* Updated room tiles to display user names instead of group names for clearer identification.
* Prepared various screens in the app for a big upcoming change—stay tuned! 😉✨
* 🎉👥Added both the Chat and Games tabs to groups—just the beginning of big upgrades coming to groups!
* Enhanced the Room calling UI by adding a "Calling" alert, opening the game chooser when creating a room and inviting, and updating icons to show whether it's a call or invite 📞🎮
* Overhauled the Members Pane with a new "Add Member" button, better navigation, active room indicators, and updated sorting to prioritize online members!
* Added a call-group member picker so you can easily select up to 5 people to join you in a room!
* Improved the Game Details header and scroll behavior, plus removed the extra "Play" button for a cleaner look.

## 🪲Bug Fixes

* 🎨📱 Fixed various header display issues, including transparency on the home screen, gaps on iOS daily rewards, corrected gem center colors, and removed the dark bar on the Add Groupmate screen!
* Stopped the app from showing the add email banner for users who already have an email linked 📧🚫
* Resolved a strange rendering issue when opening the member pane popup or other translucent overlays 🖼️✨
* Refined the friends list bottom sheet to match the member pane popup and fixed a bug where friend-requested users showed as inactive until the request was accepted 🔧
* Addressed an issue where the wrong group was invited to a room when hitting play from a DM’s games view, ensuring proper friend vs. group handling and forcing re-renders with updated navigation keys.
* Corrected the online members count in group headers to include only online users, not "Away" users!
* Refined the member pane styling in groups to prevent messages from scrolling behind it during group verification on iOS 📱
* Adjusted push notification handling to prevent unnecessary app initialization when the app isn’t running 🔔
* Upgraded react-native-callkeep to fix an iOS crash caused by joining flow from a realm!
* Removed the flash of the "No Friends" screen on cold boot by displaying a loading state until friends are fully loaded ⏳
* Upgraded app navigation to prevent white flashes when moving quickly and ensure notifications always take you to the right place 🚀
* Prevented a few "Gremlins" login errors by ensuring the 'prepare for auth' process runs after exiting verification or removing local user accounts 👾🔑
* Prevented a crash when receiving a background call due to "Cannot read property 'routes' of undefined" 📞🚫
* 📏 Adjusted spacing on the group rooms screen to align properly with the new controls.
