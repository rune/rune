---
sidebar_position: 3
---

# Best Practices

Here's some advice on making your game a great experience for the players!

### Gameplay Should Start Easy and Simple {#gameplay-should-start-easy-and-simple}

As a game dev, it's easy to think that your game is very simple to understand. That's because you made it 😅 Players will need to understand how your game works and what everything means. For that reason, we highly recommend you start your gameplay simple and easy.

### Use Icons Instead of Text {#use-icons-instead-of-text}

Most players prefer visual explanations instead of reading so it's ideal if your game can be understood without reading.

### Translate Text For Non-English Players {#translate-text}

There's many non-English players on Dusk so you increase your game's chances of success if you internationalize it by translating all text. The biggest non-English audiences on Dusk speak Spanish, Russian and Portuguese so translate your game into those languages.

### Support Solo Play {#support-solo-play}

Many players like to try out your game alone before showing it to their friends. Your game is therefore more likely be picked up by the community if players can play it alone.

### Support Two Players {#support-two-players}

The majority of rooms on Dusk have exactly two players. For your game to be most successful, we recommend that it supports playing and is fun when played with one other person.

### Support Spectating {#support-spectators}

Players on Dusk can spectate your game 👀 This can happen in many ways, e.g. if someone joins after the room has hit your game's `maxPlayers` or if someone joins after your game has called `Dusk.gameOver()`. You can identify spectators by having `yourPlayerId` as undefined (see [Player Info](../how-it-works/player-info.md)). Spectators should see all gameplay, but not have any UI for performing actions.

### Avoid UI Like Menu Screens, Pause Buttons, Audio Buttons, etc. {#avoid-ui-like-menu-screens-pause-buttons-high-score-screen-etc}

Dusk’s UI provides a simple way to play/pause/restart that works for all games so you don’t need a menu screen or a pause button in your game. This lets players get into the action of your game, thereby making it faster to start playing and more fun for players! Similarly, there's no need for any audio buttons as Dusk has in-app UI for that, making things simpler for players.

### Avoid Ads, Branding and Links {#avoid-ads-branding-and-links}

One of the amazing things about Dusk is that there’s no ads. Leave out any ads, branding and links from your game to keep the focus on the gameplay experience 🧘

### Persist Player Progress Across Game Sessions {#avoid-using-cookies-localstorage-or-indexeddb}

Players enjoy when they make progress in your game across sessions such as unlocking new content or achieving high scores. Use Dusk's built-in [persistence API](../advanced/persisted-data.md) to save data in a reliable way that automatically syncs it across a user's devices. Avoid using cookies, local stage or IndexedDB as iOS/Android may clear those. 

### Avoid Loading Bars and Calling `Dusk.initClient()` Prematurely {#avoid-progress-bars-and-calling-duskinitclient-prematurely}

Dusk shows an animation while your game is loading. It's a smoother player experience to only have one progress bar to load your game. Avoid having a loading screen in your game by waiting with calling `Dusk.initClient()` until your game has fully completed loading.

### Send Player Input rather than Player State in Actions {#send-player-input}

We recommend sending player input in actions (e.g. "turning left") rather than player state (e.g. the player's position). This minimizes network data and allows other clients to simulate ahead, thereby making your game work better in bad network settings. Similarly, only send an action when the input changes instead of sending the same player input repeatedly.

### Gameplay Should not be Affected by Screen Size {#gameplay-should-not-be-affected-by-screen-size}

Your game should ideally scale from small narrow phones with resolutions like 280×653 to wide tablets with resolutions like 1280×800. The gameplay area can be even less on small phones, e.g. only 450 pixels high. Gameplay should not be affected by aspect ratio or resolution. Make sure your game scales to cover the entire screen to provide the best experience.

### Polish Your Dusk Profile {#polish-your-dusk-profile}

Adjust your name, avatar, and description in Dusk app Profile tab. Your profile will be publicly visible in Dusk app for games that you have created or contributed to.