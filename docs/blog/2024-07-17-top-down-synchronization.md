---
title: Networking a Top Down RPG  
description: Tech demo for top down games 
slug: top-down-synchronization 
tags: [Game Development, Tech Demo] 
image: /img/blog/social-previews/top-down-synchronization.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Rune  
  url: https://www.linkedin.com/in/kevglass/
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>Networking a Top Down RPG</title>
  <meta property="og:title" content="Networking a Top Down RPG"/>
</head>

Here at Rune we provide a multiplayer Javascript games SDK and platform for everyone to get their creations out to 1000s of players. We provide technical demos to illustrate how you can use the platform to implement various game types.

![](/img/blog/callouts/top-down-synchronization.gif)

I’ve been putting together a new tech demo that shows how to implement the basic synchronization of movement between clients connected in a Rune room for a top down game. You can try it out [here](../../tech-demos/top-down-synchronization/). Starting here gives us a super simple example of how to wire everything up without worrying about gravity/physics or complex collision detection.

Let’s start by looking at the architecture of a Rune game and the separation between rendering and logic.

![](/img/blog/callouts/client-logic.png)

It’s often considered good practice to separate your data model and logic from the rendering, i.e. the MVC pattern. However, when it comes to multiplayer this isn’t just best practice, it’s absolutely required to let us run copies of the game logic on both the server and client. 

The logic should only contain the data that is required to make the decisions about how the game updates and how winning/losing can be evaluated - i.e. the game state. We want to try and keep it as simple and fast as possible since in the predict-rollback network model (that Rune uses) we will be running multiple copies of the logic. The logic has to be [implemented with some restrictions](/docs/how-it-works/syncing-game-state) that allow it to be executed both on the browser and server.

The renderer, or client, is the code that actually converts the game state to something that the player can view and interact with. The client can be implemented using any library or framework that can run in the browser. 

Let’s get to the code, I’m going to assume you already know how to [create a game project](https://developers.rune.ai/docs/quick-start) and just jump straight into the logic. In this demo we’re going to have a map, players and trees. So first let’s declare some types to describe those:

```js
// types of entities we'll display in the world
export type EntityType = "PLAYER" | "TREE"

// an entity is anything that is displayed in the world
// outside of the base tile map. These will be
// z-sorted to give top down style depth
export type Entity = {
  x: number
  y: number
  sprite: number
  type: EntityType
  playerId?: PlayerId
}

// the extra data for the player
export type Player = {
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
} & Entity

// the controls that we're applying to the game state
// based on which inputs the player is currently pressing
export type Controls = {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
}
```

Next we’ll need to describe the game state we want to synchronize, in Rune that’s as easy as this:

```js
// this is the core of what we're trying to keep
// in sync across the network. It'll be held on clients
// and server and the Rune platform will keep it
// in sync by applying deterministic actions
export interface GameState {
  entities: Entity[]
  players: Player[]
}
```

We need to setup an initial state for the game which all clients will start from before applying changes they receive from clients:

```js
Rune.initLogic({
  setup: (allPlayerIds) => {
    const initialState: GameState = {
      entities: [],
      // for each of the players Rune says are in the game
      // create a new player entity. We'll initialize their
      // location to place them in the world
      players: allPlayerIds.map((p, index) => {
        return {
          x: (index + 1) * 64,
          y: (index + 1) * 64,
          playerId: p,
          type: "PLAYER",
          sprite: index % 4,
          animation: Animation.IDLE,
          controls: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          flipped: false,
          vx: 0,
          vy: 0,
        }
      }),
    }

    // add the tree entities
    for (const tree of trees) {
      initialState.entities.push({
        type: "TREE",
        x: tree[0],
        y: tree[1],
        sprite: 4,
      })
    }

    return initialState
  },
```

In the game logic we need to declare what the clients can do and how the game should update each frame. In Rune the game update is defined as part of setting up the Rune SDK like so:

```js
update: ({ game }) => {
    // go through all the players and update them
    for (const entity of game.entities.filter((e) => 
            e.type === "PLAYER")) {
      const player = entity as Player
      // assume the player is doing nothing to start with
      player.animation = Animation.IDLE

      // for each control that the player has pressed attempt to move them
      // in the appropriate direction. Only move if the player isn't blocked
      // by whatever is in the tile map.
      if (player.controls.left) {
        player.vx = Math.max(-MOVE_SPEED, player.vx - MOVE_ACCEL)
        player.flipped = true
      } else if (player.controls.right) {
        player.vx = Math.min(MOVE_SPEED, player.vx + MOVE_ACCEL)
        player.flipped = false
      } else {
      ...
```

The game logic is configured to run at 30 updates a second and on each update we’re going to move the players based on what their controls are - i.e. are they pushing up/down/left/right. There’s a simple tile map collision check in there to stop the player running off the side of the world - but that’s it. 

So how does this synchronize the clients? 

The Rune platform runs this logic on the server and each of the clients. When a change is made to the game state is first applied locally - so latency in controls is very low - and then sent to the server and subsequently to all other clients. This is all timed so that the local client isn’t applying the changes too early and gives the server time to schedule the change at the right time.

So everyone playing and the server have a copy of the game logic which they’re keeping up to date based on the changes they receive. This relies on the [game logic being fully deterministic](/docs/how-it-works/syncing-game-state) but from a developer point of view means you don’t really have to think about how the sync is happening. As long as you keep your updating code in the game logic, the clients will stay in sync. 

The client will run a copy of this logic and `update()` loop so will immediately update is run. The server will also run a copy of this logic and `update()` loop but slightly behind the client to allow for any action conflict resolution, e.g. two players try to take the same item. When the server has resolved the conflict the client will rollback its changes if needed and apply the new actions from the authoritative server putting the client back in the correct state.

The final bit of the game logic is how the “changes” to the game state can be indicated by players, what Rune calls actions. 

```js
// actions are the way clients can modify game state. Rune manages
// how and when these actions are applied to maintain a consistent
// game state between all clients.
actions: {
  // Action applied from the client to setup the controls the
  // player is currently pressing. We simple record the controls
  // and let the update() loop actually apply the changes
  controls: (controls, { game, playerId }) => {
      const entity = game.players.find((p) => p.playerId === playerId)

      if (entity && entity.type === "PLAYER") {
        (entity as Player).controls = { ...controls }
      }
  },
},
```

The actions block defines the set of calls the renderer can make to translate player input into changes to the game state. In this case we simply take whatever the client has said the controls from the player are and store them in the player entity. As mentioned above, because the client is running its own copy of logic these changes are quickly applied.

You can see in this case we’re sending the controls rather than explicit positions, which at first might seem a little strange. This makes sense when you consider one more factor, conflict resolution. 

If two players both make actions on their local copy of logic that conflict in some game specific way then the clients have to rollback their game state, apply the actions in the correct order and recalculate game state. Let’s say they both try to take an item at the same time, because their logic is running locally they’ll both think they took it. Once the actions reach either end it becomes clear that one player took the item first and the Rune SDK calculates the state to match the correct situation. 

Now, if we sent explicit positions this conflict resolution would result in significant jumps - where a player’s actions were completely disregarded because they were in complete conflict. If we send the controls then the resolution is much smoother, the player still pressed the controls and had them applied, just the resulting game state is a little different. A lot of the time this can be hidden altogether in the renderer.

Now we have the game logic, the players can update controls and they’ll move thanks to our update loop. The final part is to get something on the screen and let our players play! The tech demo uses a very simple renderer without a library or framework. It just draws images (and parts of images) to a HTML canvas and uses DOM events for input. Check out [graphics.ts](https://github.com/rune/rune/tree/staging/tech-demos/top-down-synchronization/src/graphics.ts) and [input.ts](https://github.com/rune/rune/tree/staging/tech-demos/top-down-synchronization/src/input.ts) if you want to see the details. 

First we need to register a callback with Rune so that it can tell us about changes to game state:

```js
// Start the Rune SDK on the client rendering side. 
// This tells the Rune app that we're ready for players 
// to see the game. It's also the hook
// that lets the Rune SDK update us on 
// changes to game state
Rune.initClient({
  // notification from Rune that there is a new game state
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
// if the Rune SDK has given us a game state then
// render all the entities in the game
if (gameState) {
  // render all the entities based on the current game state
  const allEntities = [...gameState.entities, ...gameState.players]

  ;allEntities
  .sort((a, b) => a.y - b.y)
  .forEach((entity) => {
    if (entity.type === "PLAYER") {
    // players need to be rendering using animation 
    // and flipping
    const player = entity as Player
    drawTile(
        player.x - playerFootPosition[0],
        player.y - playerFootPosition[1],
        entitySprites[player.sprite],
        player.animation + frame,
        player.flipped
    )
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
    gameInputs.up !== lastSentControls.up ||
    gameInputs.down !== lastSentControls.down)
) {
    lastSentControls = { ...gameInputs }
    lastActionTime = Date.now()
    Rune.actions.controls(lastSentControls)
}
```

There’s a couple of gates put on sending actions. We don’t want to send unchanged controls into the game logic, it won’t change anything and wastes bandwidth. The Rune SDK also limits us to 10 actions per second from any client so we make sure we’re not breaking that.

That’s pretty much it, we have a game logic that will keep the client’s game state in sync and a renderer that will let our players play. Of course this is a simple tech demo but with a little more work, collision between players, fighting and item collection could easily be added.

If you have any questions or comments on the tech demo or Rune in general, be sure to join our [Discord](https://discord.gg/rune-devs).

Assets from [Pixel Frog](https://pixelfrog-assets.itch.io/tiny-swords).


