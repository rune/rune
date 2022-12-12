---
sidebar_position: 4
---

# Best Practices

These are some good practices that make your game a good experience for the players.

### Use Portrait Mode

Rune players love playing with one hand and swiping between games so players prefer if your game uses portrait mode.

### Avoid UI Like Menu Screens, Pause Buttons, High Score Screen, _etc_

Rune’s UI provides a simple way to pause/play/restart that works for all games so you don’t need a menu screen or a pause button in your game. This lets players get into the action of your game, thereby making it faster to start playing and more fun for players.

### Avoid External Branding or Ads

One of the amazing things about Rune is that there’s no ads. Leave out any branding or ads to keep the focus on the gameplay experience.

### Avoid Using Cookies, `localStorage` or `IndexedDB`

Players expect any level information to persist indefinitely, but iOS/Android may reset the cache and clear this information. We're working on a way to make saving data more robust and sync it across devices, but until then please avoid saving data.

### Avoid Progress Bars and Calling `Rune.init()` Prematurely

Rune shows an animation while your game is loading. It can be confusing if there's another progress bar in your game itself. To avoid this, wait with calling Rune.init() until your game has fully completed loading.

### Gameplay Should not be Affected by Screen Size

Your game should ideally scale from small narrow phones with resolutions of 280×653 to wide tablets with resolutions of 1280×800. Gameplay should not be affected by aspect ratio or resolution. Make sure your game scales to cover the entire screen to provide the best player experience.

### Use Icons Instead of Text

Many players speak little to no English so it's ideal if your game can be understood without understanding English.

### Use Daily Challenges to Keep Game Exciting

[Daily challenges](singleplayer/challenges.md) are optional, but a great way to make your game have something new and exciting every day. Different colors / maps / physics — it's completely up to your creativity! If your game supports daily challenges, Rune will automatically add daily leaderboards. Players love having a fresh leaderboard to compete on every day!
