---
title: New Updates! May 1st-15th 2025
description: Release notes for the Rune platform 
slug: release-notes-may-1st-2025
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
  <title>New Updates! May 1st-15th 2025</title>
  <meta property="og:title" content="New Updates! May 1st-15th 2025"/>
</head>

## 🛠️ App Improvements

* 🎉 Kicked off the Rune MCP project—our new AI tool for instantly spinning up Rune games with VSCode, going from an empty folder to a running game in seconds! 🤖🚀 
* 📦 Pulled in starter templates from the Rune repo to bootstrap game creation.
* Built an interactive version of the "create Rune game" tool with a polished prompt flow for easier game scaffolding.
* Updated the README with local testing instructions, VS Code setup, and a new inspect script for smoother debugging 📖
* 🔇 Removed stray console logs to keep output clean and useful for tooling.
* Added installDependenciesForProject tool to automate setup during game creation.
* 🌐 Added tools for dev server launch and auto-open support directly in the MCP for instant feedback.
* Implemented graceful shutdown handling so the MCP server exits cleanly when interrupted.
* 🧪 Began refining prompt UX and parameter descriptions to make the AI more intuitive.
* Added tools to detect and restart the dev server, plus a check project errors tool to lint and fix issues automatically 🔍
* Introduced the explain-rune-project tool to make the AI easily understand generated projects 🗂️ 
* Updated network URL reporting to handle edge cases where some dev server URLs may fail to connect 🌐
* 🧠 Introduced multiplayer sync fundamentals like predict-rollback netcode, rate limits, and stateless logic architecture—backed by working examples.
* Improved prompts for the AI to generate better Rune-compatible code by documenting required logic structure and multiplayer flow.
* 📱 Added mobile-specific prompts for screen size handling and orientation locking.

## 🪲 App Bug Fixes

* Restored group membership checks before navigating to group chat on minimize to prevent unintended access 👥🔒
