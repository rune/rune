# Integrating GameMaker games with Rune SDK

## General
The Rune app is a wrapper that runs web games and communicates with them using a Javascript API. 

Through the HTML5 export it is possible to connect a GameMaker game with the API by manually editing the IDE build.

## Setting up

Download [gamemaker_rune_package.yymps](./gamemaker_rune_package.yymps) and import it through the Tools -> Import Local Package menu.

Call `restart_game()` and `rune_init()` at the start of your game and `rune_gameover()` whenever the player looses. You can refer to the [red button game](../examples/red-button/) as an example.

Note that the value returned by `rune_challenge_nr()` is used as the random generator seed when you call `restart_game()` (through the `init_game()` call). This automatically adds support for daily challenges by returning deterministic values for all GameMaker random methods.

## Build your game

*Look at the [finished example build](<./finished example build/>) if any of the following steps are unclear.*

Select the HTML5 platform as your build target (top right corner in GMS2). 

Click the export button (Create executable) and select "Package as Loose Files".

Go to the new folder created by GameMaker.

Open the `index.html` and include the Rune SDK by adding the following code as the first child of the `<head>` element:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@2.5.1/dist/browser.min.js"></script>
```

Open `html5game/your game.js`. This contains the obfuscated Javascript code that GameMaker generated for your game. You need to identify the `restart_game()`, `resume_game()`, `pause_game()` and `get_score()` methods from the `scr_rune` Script. 

You can search for strings of the debug messages like "Restart game", that will still be in readable form. You can copy the section with these strings out of the main document and format it by replacing "}" with "}\n". You'll find that the names of the functions look something like `_b3`.

Open `html5game/tph_rune_connector.js`, uncomment the Rune API calls, remove `return 1;` from the `rune_challenge_nr()` function and add the obfuscated function names from `html5game/your game.js` to the `Rune.init` call.

The build is now finished, your GameMaker game can communicate with the Rune API in both directions.

### Running Your Game

It is recommended to test your GameMaker project by running is as a normal HTMl5 game inside GMS2 first to avoid redoing the manual editing of the build. Once you want to test the Rune connection specifically, the [Rune CLI](https://github.com/rune/rune-games-cli) can run your game in a mock
Rune app, install it by running:

```sh
npm install -g rune-games-cli
```

Run the game by calling:

   ```shell
   cd my-game-folder
   rune start
   ```
