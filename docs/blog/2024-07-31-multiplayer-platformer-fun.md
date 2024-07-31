---
title: Multiplayer Platformer Fun  
description: Tech demo networking a platformer on Dusk
slug: multiplayer-platformer-fun 
tags: [Game Development, Networking]
image: /img/blog/social-previews/multiplayer-platformer-fun.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Dusk  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Multiplayer Platformer Fun</title>
  <meta property="og:title" content="Multiplayer Platformer Fun"/>
</head>

In the second tech-demo, we look at making a platform game multiplayer using the Dusk SDK. For anyone following along the base code is the same as the last [technical demo](https://developers.dusk.gg/blog/top-down-synchronization), but we'll cover most of it in this article.

![](/img/blog/callouts/platformer.gif)

You can give it a go on the [tech demos page](/tech-demos/platformer/). 

First a re-cap of the architecture of a Dusk game. We separate the rendering and logic like so:

![](/img/blog/callouts/client-logic.png)

It’s good practice to separate your data model and logic from the rendering, i.e. the MVC patter. With multiplayer this isn’t just best practice, it’s absolutely required to let us run copies of the game logic on both the server and client. 

The logic should only contain the data that is required update the game and how winning/losing can be evaluated - i.e. the game state. We want to try and keep it fast since in the predict-rollback network model (that Dusk uses) we will be running multiple copies of the logic. The logic has to be [implemented with some restrictions](/docs/how-it-works/syncing-game-state) that allow it to be executed both on the browser and server.

The renderer, or client, is the code the renders to the game for the player and accept their input. The client can be implemented using any library or framework that can run in the browser. 

Let’s get to the code. If you need directions on [creating a game project](https://developers.dusk.gg/docs/quick-start) they're in the docs. In this demo we’re going to have a map and some players. So first let’s declare some types to describe those:

```javascript
// the extra data for the player
export type Player = {
  x: number
  y: number
  sprite: string
  playerId?: PlayerId
  // the state of the controls for this player - this
  // is the bit thats actually sent regularly across
  // the network
  controls: Controls
  animation: Animation
  vx: number
  vy: number
  // true if the player is facing left instead of right
  // as the sprites are designed
  flipped: boolean
}

// the controls that we're applying to the game state
// based on which inputs the player is currently pressing
export type Controls = {
  left: boolean
  right: boolean
  jump: boolean
}
```

For Dusk to synchronize the clients we'll need to define the shared data, in Dusk that’s as easy as this:

```js
// this is the core of what we're trying to keep
// in sync across the network. It'll be held on clients
// and server and the Dusk platform will keep it
// in sync by applying deterministic actions
export interface GameState {
  players: Player[]
}
```

Next we can initialize the logic for the game game which all clients will start from before applying changes they receive from clients:

```js
Dusk.initLogic({
  setup: (allPlayerIds) => {
    const initialState: GameState = {
      // for each of the players Dusk says are in the game
      // create a new player entity. We'll initialize their
      // location to place them in the world
      players: allPlayerIds.map((p, index) => {
        return {
          x: 20 + (index + 1) * 32,
          y: 260,
          playerId: p,
          type: "PLAYER",
          sprite: PLAYER_TYPES[index % PLAYER_TYPES.length],
          animation: Animation.IDLE,
          controls: {
            left: false,
            right: false,
            jump: false,
          },
          flipped: false,
          vx: 0,
          vy: 0,
        }
      }),
    }

    return initialState
  },
```

In the game logic we need to declare what the clients can do and how the game should update each frame. In Dusk the game update is defined as part of setting up the Dusk SDK like so:

```js
update: ({ game }) => {
    // go through all the players and update them
    for (const player of game.players) {
      player.animation = Animation.IDLE

      if (player.controls.left) {
        player.vx = Math.max(-MOVE_SPEED, player.vx - MOVE_ACCEL)
        player.flipped = true
      } else if (player.controls.right) {
        player.vx = Math.min(MOVE_SPEED, player.vx + MOVE_ACCEL)
        player.flipped = false
      } else {
        if (player.vx < 0) {
          player.vx = Math.max(0, player.vx + MOVE_ACCEL)
        } else if (player.vx > 0) {
          player.vx = Math.min(0, player.vx - MOVE_ACCEL)
        }
      }

      player.vy += GRAVITY
      ...
```

The game logic is configured to run at 30 updates a second and on each update we’re going to move the players based on what their controls are - i.e. are they pushing left/right.jump. We're going to have two sets of collision, one against a tile map for the level and another between players. This lets players use each other as platforms!

The collision code is brute force, look for tiles that we might be colliding with and then check rectangle/rectangle collision for the players. You can see that in `isValidPosition`.

So how does this synchronize the clients? 

The Dusk platform runs this logic on the server and each of the clients. When a change is made to the game state is first applied locally - so latency in controls is very low - and then sent to the server and subsequently to all other clients. This is all timed so that the local client isn’t applying the changes too early and gives the server time to schedule the change at the right time.

So everyone playing and the server have a copy of the game logic which they’re keeping up to date based on the changes they receive. This relies on the [game logic being fully deterministic](/docs/how-it-works/syncing-game-state) but from a developer point of view means you don’t really have to think about how the sync is happening. As long as you keep your updating code in the game logic, the clients will stay in sync. 

The client will run a copy of this logic and `update()` loop so will immediately update is run. The server will also run a copy of this logic and `update()` loop but slightly behind the client to allow for any action conflict resolution, e.g. two players try to take the same item. When the server has resolved the conflict the client will rollback its changes if needed and apply the new actions from the authoritative server putting the client back in the correct state.

The final bit of the game logic is how the “changes” to the game state can be indicated by players, what Dusk calls actions. 

```js
// actions are the way clients can modify game state. Dusk manages
// how and when these actions are applied to maintain a consistent
// game state between all clients.
actions: {
  // Action applied from the client to setup the controls the
  // player is currently pressing. We simple record the controls
  // and let the update() loop actually apply the changes
  controls: (controls, { game, playerId }) => {
    const player = game.players.find((p) => p.playerId === playerId)

    if (player) {
      player.controls = { ...controls }
    }
  },
},
```

The actions block defines the set of calls the renderer can make to translate player input into changes to the game state. In this case we simply take whatever the client has said the controls from the player are and store them in the player entity. As mentioned above, because the client is running its own copy of logic these changes are quickly applied.

You can see in this case we’re sending the controls rather than explicit positions, which at first might seem a little strange. This makes sense when you consider one more factor, conflict resolution. 

If two players both make actions on their local copy of logic that conflict in some game specific way then the clients have to rollback their game state, apply the actions in the correct order and recalculate game state. Let’s say they both try to take an item at the same time, because their logic is running locally they’ll both think they took it. Once the actions reach either end it becomes clear that one player took the item first and the Dusk SDK calculates the state to match the correct situation. 

Now, if we sent explicit positions this conflict resolution would result in significant jumps - where a player’s actions were completely disregarded because they were in complete conflict. If we send the controls then the resolution is much smoother, the player still pressed the controls and had them applied, just the resulting game state is a little different. A lot of the time this can be hidden altogether in the renderer.

Now we have the game logic, the players can update controls and they’ll move thanks to our update loop. The final part is to get something on the screen and let our players play! The tech demo uses a very simple renderer without a library or framework. It just draws images (and parts of images) to a HTML canvas and uses DOM events for input. Check out [graphics.ts](https://github.com/dusk-gg/dusk/tree/staging/tech-demos/platformer/src/graphics.ts) and [input.ts](https://github.com/dusk-gg/dusk/tree/staging/tech-demos/top-down-synchronization/src/input.ts) if you want to see the details. 

First we need to register a callback with Dusk so that it can tell us about changes to game state:

```js
// Start the Dusk SDK on the client rendering side. 
// This tells the Dusk app that we're ready for players 
// to see the game. It's also the hook
// that lets the Dusk SDK update us on 
// changes to game state
Dusk.initClient({
  // notification from Dusk that there is a new game state
  onChange: ({ game, yourPlayerId }) => {
    // record the ID of our local player so we can 
    // center the camera on that player.
    myPlayerId = yourPlayerId

    // record the current game state for rendering in
    // out core loop
    gameState = game
  },
})
```

The rendering itself is purely taking the game state that it’s been given and drawing entities to the canvas:

```js
// if the Dusk SDK has given us a game state then
// render all the entities in the game
if (gameState) {
  // render the game state
  for (const player of gameState.players) {
    const frames =
      player.animation === Animation.JUMP
        ? playerArt[player.sprite].jump
        : player.animation === Animation.WALK
          ? playerArt[player.sprite].run
          : playerArt[player.sprite].idle

    drawTile(
      player.x - 16,
      player.y - 16,
      frames,
      Math.floor(Date.now() / 50) % frames.tilesAcross,
      player.flipped
    )
  }
    ...
```

The only other thing the renderer needs to do is convert player inputs into that action we defined in game logic:

```js
// we're only allowed to update the controls 10 times a second, so
// only send if its been 1/10 of a second since we sent the last one
// and the controls have changed
if (
    Date.now() - lastActionTime > 100 &&
    (gameInputs.left !== lastSentControls.left ||
    gameInputs.right !== lastSentControls.right ||
    gameInputs.jump !== lastSentControls.jump)
) {
    lastSentControls = { ...gameInputs }
    lastActionTime = Date.now()
    Dusk.actions.controls(lastSentControls)
}
```

There’s a couple of conditions put on sending actions. We don’t want to send unchanged controls into the game logic, it won’t change anything and wastes bandwidth. The Dusk SDK also limits us to 10 actions per second from any client so we make sure we’re not breaking that.

That’s pretty much it, we have a game logic that will keep the client’s game state in sync and a renderer that will let our players play. 

If you have any questions or comments on the tech demo or Dusk in general, be sure to join our [Discord](https://discord.gg/dusk-devs).

Assets from [Pixel Frog](https://pixelfrog-assets.itch.io/pixel-adventure-1).
