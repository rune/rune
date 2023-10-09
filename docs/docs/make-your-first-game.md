# Building Your First Game with Rune SDK: Flip Flop

Welcome aboard! In this guide, we'll escort you through crafting your first game, "Flip Flop", harnessing the Rune SDK. Upon completion, you'll have a multiplayer game tailored for Rune's vast player community. This guide uses vanilla typescript, for the sake of brevity, I will not go through every single line of code, the full code can be found on [https://github.com/omar-abdul/flip-flop](https://github.com/omar-abdul/flip-flop)

#### Prerequisites

- Proficiency in JavaScript, TypeScript, and HTML.
- Node.js and npm/yarn installed.
- A brief look through the Rune SDK Quick Start guide.

### What are we going to build
"Flip Flop" is a delightful memory tile matching game where the goal is to match pairs with the fewest moves possible.


### Step 1. Install and Configure

1. Run vite with vanilla and ts

```bash
# npm
$ npm create vite@latest flip-flop --template vanilla-ts
# yarn
$ yarn create vite flip-flop --template vanilla-ts
# pnpm
$ pnpm create vite flip-flop --template vanilla-ts

```




2. Install rune-sdk and vite plugin

```bash
# yarn
yarn add --dev vite-plugin-rune rune-games-sdk

# npm
npm install --dev vite-plugin-rune rune-games-sdk
```

3. Create a `vite.config.ts` file and place this code inside it

```js
// vite.config.ts
import { defineConfig } from "vite";
import rune from "vite-plugin-rune";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [rune({ logicPath: "./src/logic.ts" })],
});
```

4. Create file logic.ts inside src directory and place this code

```ts
import type { RuneClient } from "rune-games-sdk/multiplayer";

export interface GameState {}

export type GameActions = {};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}
```

5. Import it in the html before the main.ts file

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/logic.ts"></script>
    <!-- add file here-->
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

6. Add `Rune.initClient` at the end of the main.ts file

   ```js
   Rune.initClient({
     onChange: ({ newGame }) => {},
   });
   ```

 Now you should see the `vite + ts` screen logo inside a smartphone frame

# Step 2
### Game UI

To start we are going to render some tiles on the screen, but before we render them let us create a json file that will hold our data  in my case will name it themes.json

```json
{
    "retro":[
        {"value":"1"},
        {"value":"2"},
        {"value":"3"},
        {"value":"4"},
        {"value":"5"},
        {"value":"6"},
        {"value":"7"},
        {"value":"8"}
    ]
}
```
this json object will hold the values that we will use to match the tiles.

Now we shall double the array, shuffle it and render the tiles, for the style.css you can find it at [https://github.com/omar-abdul/flip-flop/blob/main/src/style.css](https://github.com/omar-abdul/flip-flop/blob/main/src/style.css)
```ts
//tiles.ts

import { createElement, shuffle } from "../util/util";
import * as theme from "./themes.json";

const arrayDoubled = [...theme.retro, ...theme.retro];
export const shuffledArray = shuffle(arrayDoubled);

export function renderTiles() {
  const grid = createElement("div");
  grid.classList.add("grid");

  for (let i = 0; i <= shuffledArray.length - 1; i++) {
    const { value } = shuffledArray[i];

    const tileContainer = createElement("div");
    tileContainer.classList.add("tile-container");
    tileContainer.dataset.tileValue = value;

    tileContainer.dataset.flipped = "false";

    const tile = document.createElement("div");
    tile.classList.add("tile");
    const tileFront = createElement("div");
    tileFront.classList.add("tile-front");
    const innerP = createElement("p");
    innerP.classList.add("p-value");
    innerP.innerText = value;
    tileFront.appendChild(innerP);
    tile.appendChild(tileFront);
    const tileBack = createElement("div");
    tileBack.classList.add("tile-back");
    tile.appendChild(tileBack);
    const tileSideLeft = createElement("div");
    tileSideLeft.classList.add("tile-side", "left");
    tile.appendChild(tileSideLeft);

    const tileSideRight = createElement("div");
    tileSideRight.classList.add("tile-side", "right");
    tile.appendChild(tileSideRight);

    tileContainer.appendChild(tile);
    grid.append(tileContainer);
  }

  return grid;
}


```
and the code for shuffling

```ts
//util.ts

// ....

export function shuffle<T>(array: T[]): T[] {
  // This is using the Fisher-Yates (also known as Knuth or Durstenfeld) shuffle.
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
//....

```

This is suffienct to render the tiles now we can call it inside our app.ts
```ts
//app.ts
import { getAppContainer } from "../util/util";
import { attachListenerToFlip, renderTiles } from "./tiles";

export function renderApp() {
  const app = getAppContainer();

  app.append(renderTiles()); //renderTiles under this container

 
}


```


We should have forward facing tiles, but those aren't any fun, we want to interact with the game and that requires changing its state, that is where logic.ts comes in play

Inside logic.ts you describe the initial game state, and the actions to change those states. This goes for Any state that needs to be communicated globaly through the system, and requries some behaviour to mutate it or change it. 

These changes are accessible to the client (in our case `main.ts`) through the method `Rune.initClient()`that takes an  object with an OnChange function, this function is triggered when the state is initialized and everytime the state changes. The `onChange` function inside the `Rune.initClient()` has access to the game object which carries all our other states, it also has access to the number of players, the previous state,  the action that was called and so on.  For more reading check [https://developers.rune.ai/docs/api-reference#runeinitclientoptions](https://developers.rune.ai/docs/api-reference#runeinitclientoptions)

The only way for the client to make changes to the state is through the actions or `Rune.actions.actionName()` 

Enough concepts lets get dive in,

```ts
//logic.ts

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 1,
  setup: (allPlayerIds) => {
    const scores: Record<string, number> = {};
    for (const playerId of allPlayerIds) {
      scores[playerId] = 0;
    }
    return {
      match: [],
      flippedTiles: [],
      moves: 0,
      numberOfTiles: shuffledArray.length,
      scores,
    };
  },
  actions: {
    pushToFlippedTiles: ({ tileId }, { game, playerId }) => {
      if (game.flippedTiles.length < 2) game.flippedTiles.push(tileId);
      if (game.flippedTiles.length === 2) {
        game.moves++;
        game.scores[playerId] = game.moves;
        if (game.flippedTiles[0] === game.flippedTiles[1]) {
          game.match.push(game.flippedTiles[0]);
          game.numberOfTiles -= 2;
        }
        game.flippedTiles = [];
      }
    },
    popFlippedTiles({ tileId }, { game }) {
      if (game.flippedTiles.length > 0)
        game.flippedTiles = game.flippedTiles.filter((v) => v !== tileId);
    },
    gameOver: () => {
      Rune.gameOver();
    },
  },
  update: ({ game }) => {
    if (game.numberOfTiles <= 0) {
      Rune.gameOver({ players: game.scores });
    }
  },
});


```

`logic.ts` manages the state and actions of your game. Actions change the game's state, and the Rune client communicates and tracks these changes.

To provide interactivity, you can listen to tile flips and manage matched pairs using actions in Rune. For instance, every time a tile flips, its ID is added to the flippedTiles array. If two tiles match, they get added to the match array. Tiles that don't match flip back.

Use the gamestate custom event in main.ts to listen for changes in game state and update the UI accordingly.

let's break down some of these functions

`Rune.initLogic()` is a function that holds all the logic of the game, its the brain of your game, it takes an object as parameters, the object has these properties

`minPlayers : number` minimum amount of players of the game (not less than 1)

`maxPlayers: number` maximum amount of players of the game (not more than 4)

`setup : function` a function that returns the initial state of your game, eg. scores=0, flippedTiles=[] etc all which will be available on the game object
`actions: {}` An object that holds functions as properties that can change the state of the game, eg. increment({amount:1},{game}) it takes two parameters, an object you can  pass to it with any value and the game state that you initialized in the previous step so it has access to game.scores and game.flippedTiles

`update:()` A function that runs every second, You can use this function for continous checks, or anything you need to continously do throughout the app lifecycle


Now how the above code works is that each time a tile is flipped it is added to the flippedTiles array, later if two tiles are flipped it checks that they hold the same value, if they do it adds it to the match array. Either way it clears the flippedTiles array. 


Now in the UI we can hook to our actions using the global Rune object
```ts
export function attachListenerToFlip() {
  // Select all .tile-container elements

  const tileContainers =
    document.querySelectorAll<HTMLDivElement>(".tile-container");

  const handleClicks = function (container: HTMLDivElement) {
    if (!checking) {
      if (container.dataset.flipped === "false") {
        if (flippedArr.length < 2) { 
          Rune.actions.pushToFlippedTiles({ 
            tileId: container.dataset.tileValue!,
          }); //here we call the pushtoFlippedTiles action with the parameter of tileId  which populates the flippedTiles array

          container.dataset.flipped = "true";
        }
      } else {
        Rune.actions.popFlippedTiles({
          tileId: container.dataset.tileValue!,
        });//When tiles are unflipped
        container.dataset.flipped = "false";
      }
    }
  };
  tileContainers.forEach((container) => {
    container.addEventListener("click", () => handleClicks(container));
  });
}

document.addEventListener("gamestate", function (e) {

    //We listen to the gamestate custom event that we emitted any time the game state is changed in main.ts
  const { flippedTiles, match } = e.detail.game; // we have access to the game object which carries our state 

  flippedArr.length = 0;
  flippedArr.push(...flippedTiles);
  if (flippedArr.length === 0) {
    match.map((value) => {
        //if the two tiles match add the matched dataset to make it fade
      document
        .querySelectorAll<HTMLDivElement>(".tile-container")
        .forEach((container) => {
          if (container.dataset.tileValue === value) {
            checking = true;
            container.dataset.matched = "true";
            setTimeout(() => {
              checking = false;
            }, 700);
          }
        });
    });
    document
      .querySelectorAll<HTMLDivElement>(
        '.tile-container[data-flipped="true"]:not([data-matched="true"])'
      )
      .forEach((container) => {
        // Making sure all tiles that arent matched are flipped back to their hidden state
        checking = true;
        setTimeout(() => {
          container.dataset.flipped = "false";
          checking = false;
        }, 700);
      });
  }
});

```

We call this function inside app.ts
```ts
export function renderApp() {

//previous code

    attachListenerToFlip();
}
```


and inside main.ts

```ts
import "./style.css";
import { renderApp } from "./components/app";
import { GameState } from "./logic";

interface GameDetail {
  game: GameState;
}

declare global {
  interface DocumentEventMap {
    gamestate: CustomEvent<GameDetail>;
  }
}

const updateGameEvent = (game: GameState) => {
    //Custom Event that holds new Game object
  const gameEvent = new CustomEvent("gamestate", {
    detail: {
      game,
    },
  });
  document.dispatchEvent(gameEvent);
};

renderApp();

Rune.initClient({
  onChange: ({ newGame }) => {
    //Here we are calling the updateGameEvent that dispatches a Custom Event names gamestate It is triggered with every time the game state/object changes 
    updateGameEvent(newGame);  
  },
});
```




