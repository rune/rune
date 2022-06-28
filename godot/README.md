# Integrating Godot games with Rune SDK

## Quick Start

Add the following code to "Head Include" of your HTML5 export preset:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@2.3/dist/browser.min.js"></script>
```

Add these functions (names are important) in your main script file ([read more about how to implement these functions](https://github.com/rune/rune-games-sdk#core-api)):

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

When your game is ready, call `Rune.init(self)`, for example:

```gdscript
# Main.gd

func _ready():
    some_other_game_initialization_code()
    Rune.init(self)
```

When player looses the game, call `Rune.game_over()`, for example:

```gdscript
# Main.gd

func game_over():
    some_other_game_over_logic()
    Rune.game_over()
```

That's all it takes to integrate your game with Rune!

### Running Your Game

The [Rune CLI](https://github.com/rune/rune-games-cli) runs your game in a mock
Rune app and makes debugging easy

- Install it by running

  ```sh
  npm install -g rune-games-cli
  ```

- If you want to run your game from the Godot editor, i.e.

  <img src="https://i.gyazo.com/cd7f871a890bffd669776d2790b54dda.jpg" width="300">

  then once it opens in a browser, copy the page url (e.g.
  `http://localhost:8060/tmp_js_export.html`) and run

  ```shell
  rune start http://localhost:8060/tmp_js_export.html
  ```

- Or once you export your HTML5 game to a folder, run

  ```shell
  cd my-game-folder
  rune start
  ```

## Daily Challenges (optional)

You can call `Rune.getChallengeNumber()` and `Rune.deterministicRandom()` in your Godot scripts, [read more about Daily Challenges](https://github.com/rune/rune-games-sdk#daily-challenges-optional)
