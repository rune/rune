---
sidebar_position: 3
---

# Best Practices

These are some good practices that make your game a good experience for the players.

### Use Portrait Mode

Rune players love playing with one hand and swiping between games so players prefer if your game uses portrait mode.

### Avoid UI Like Menu Screens, Pause Buttons, High Score Screen, _etc_

Rune’s UI provides a simple way to pause/play/restart that works for all games so you don’t need a menu screen or a pause button in your game. This lets players get into the action of your game, thereby making it faster to start playing and more fun for players.

### Avoid Ads, Branding and Links

One of the amazing things about Rune is that there’s no ads. Leave out any ads, branding and links from your game to keep the focus on the gameplay experience.

### Avoid Using Cookies, `localStorage` or `IndexedDB`

Players expect any level information to persist indefinitely, but iOS/Android may reset the cache and clear this information. We're working on a way to make saving data more robust and sync it across devices, but until then please avoid saving data.

### Avoid Progress Bars and Calling `Rune.initClient()` Prematurely

Rune shows an animation while your game is loading. It can be confusing if there's another progress bar in your game itself. To avoid this, wait with calling `Rune.initClient()` until your game has fully completed loading.

### Gameplay Should not be Affected by Screen Size

Your game should ideally scale from small narrow phones with resolutions like 280×653 to wide tablets with resolutions like 1280×800. The gameplay area can be even less on small phones, e.g. only 450 pixels high. Gameplay should not be affected by aspect ratio or resolution. Make sure your game scales to cover the entire screen to provide the best player experience. Rune is always in portrait mode so you don't have to worry about supporting landscape.

### Use Icons Instead of Text

Many players speak little to no English so it's ideal if your game can be understood without understanding English.

### Support Spectators

Players on Rune can spectate your game. This can happen in many ways, e.g. if someone joins after the room has hit your game's `maxPlayers` or if someone joins after your game has called `Rune.gameOver()`. You can identify spectators by having `yourPlayerId` as undefined (see [Player Info](../how-it-works/player-info.md)). Spectators should see all gameplay, but not have any UI for performing actions.

### Polish Your User Profile

Adjust your name and avatar in Rune app Profile tab - your profile will be publicly visible in Rune App for games that you created or contributed to.
