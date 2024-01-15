---
sidebar_position: 5
---

# Collaboration

When you create a game, you become an admin. As an admin, you can add other Rune users as members with different roles: Playtester, Developers or Admins.
Use `npx rune-games-cli@latest update-members` in your terminal to set up team for your game:

- List existing members
- Invite new members using Rune Tag
- Change role of existing member
- Remove existing member

After inviting new member, they will get an email invitation which they have to accept before becoming a part of the game team.

Each game has its own set of members so you can easily collaborate with different people and set Playtesters, Developers and Admins for specific games.

## Roles

All game members can [playtest](/docs/publishing/simulating-multiplayer) the latest version of your game.
All game members can see the game team (user name and role) using `npx rune-games-cli@latest list`.
Adjust your name in Rune app Profile tab - your profile will be publicly visible in Rune App for games that you created or contributed to.

Only Developers and Admins can [publish](/docs/publishing/publishing-your-game) a new version of the game.

Note that one game can have multiple Admins.
