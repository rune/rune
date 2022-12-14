# Integrating Godot games with Rune SDK

## Quick Start

Install Rune plugin for Godot by downloading [addons.zip](./addons.zip),
unzipping it into your project, then going to
`Project > Project Settings > Plugins` and clicking `Enable` on the `Rune`.

Add the following code to "Head Include" in the "HTML" section of your HTML5
export preset options:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@3/singleplayer.js"></script>
```

<img src="https://i.gyazo.com/9e8b207f5340be67144cc5a56fa7426b.png" width="600">

Add these functions (names are important) in your main script file ([read more about how to implement these functions](https://github.com/rune/rune-games-sdk/blob/staging/README.md#core-api)):

- `func rune_resume_game():`
- `func rune_pause_game():`
- `func rune_restart_game():`
- `func rune_get_score():`

Example:

```gdscript
# Main.gd

func rune_resume_game():
    get_tree().paused = false

func rune_pause_game():
    get_tree().paused = true

func rune_restart_game():
    new_game()

func rune_get_score():
    return score
```

When your game has finished loading, call `Rune.init(self)`, for example:

```gdscript
# Main.gd

func _ready():
    some_other_game_initialization_code()
    Rune.init(self)
```

When the player loses the game, call `Rune.game_over()`, for example:

```gdscript
# Main.gd

func game_over():
    some_other_game_over_logic()
    Rune.game_over()
```

That's all it takes to integrate your game with Rune! You can also take a look
at an [example game](./examples/dodge_the_creeps/Main.gd) (this is a slightly
modified ["Dodge the Creeps"](https://github.com/godotengine/godot-demo-projects/tree/master/2d/dodge_the_creeps)
example from Godot tutorials).

### Running Your Game

The [Rune CLI](https://github.com/rune/rune-games-cli) runs your game in a mock
Rune app and makes debugging easy, install it by running:

```sh
npm install -g rune-games-cli
```

To run your game, you have two options:

1. If you want to run your game from the Godot editor, i.e.

   <img src="https://i.gyazo.com/cd7f871a890bffd669776d2790b54dda.jpg" width="300">

   then once the game opens in a browser, copy its page url (e.g.
   `http://localhost:8060/tmp_js_export.html`) and run

   ```shell
   rune start http://localhost:8060/tmp_js_export.html
   ```

2. Alternatively, once you export your HTML5 game to a folder, run

   ```shell
   cd my-game-folder
   rune start
   ```

## Daily Challenges (optional)

You can call `Rune.get_challenge_number()` and `Rune.deterministic_random()` in
your Godot scripts, [read more about Daily Challenges](https://github.com/rune/rune-games-sdk/blob/staging/README.md#daily-challenges-optional)
