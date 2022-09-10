# Integrating GameMaker games with Rune SDK

## General
The Rune app is a wrapper that runs web games and communicates with them using a Javascript API. 

Through the HTML5 export it is possible to make a compatible GameMaker game.

## Setting up

### Imported files

Download [gamemaker_rune_package.yymps](./gamemaker_rune_package.yymps) and import it through the `Tools -> Import Local Package` menu.

### index.html

Open the `Included Files` dialogue and click `Open in Explorer` (or manually navigate to project location/datafiles in the file explorer) and open `rune_index.html` in the editor of your choice. Replace `GameMaker Rune Example` with your project name in line 93:
```html
<script type="text/javascript" src="html5game/GameMaker Rune Example.js?MUCYB=1817130468"></script>
```

Go to `Game Options -> Platform Settings -> HTML5 -> Advanced -> Included file as index.html` and select `rune_index.html`. Exports will now use the modified index.html that includes the Rune SDK and additional CSS.

### Function calls

Call `gmcallback_restart_game()` and `rune_init()` at the start of your game and `rune_gameover()` whenever the player looses. You can refer to the [red button game](../examples/red-button/) as an example.

Note that the value returned by `rune_challenge_nr()` is used as the random generator seed when you call `gmcallback_restart_game()` (through the `init_game()` call). This automatically adds support for daily challenges by returning deterministic values for all GameMaker random methods.

## Build your game

Select the HTML5 platform as your build target (top right corner in GMS2). 

Click the export button (Create executable) and select "Package as Loose Files".

*Look at [finished example build](<./finished example build/>) to see how the result may looks like*

### Running Your Game

Once you setup the game to communicate with Rune, running the project as a normal HTML5 game inside the IDE doesn't work anymore. Instead you can build the game and then use the [Rune CLI](https://github.com/rune/rune-games-cli) to run your game in a mock
Rune app. Install the CLI by running:

```sh
npm install -g rune-games-cli
```

Run the game by calling:

   ```shell
   cd my-finished-build
   rune start
   ```
