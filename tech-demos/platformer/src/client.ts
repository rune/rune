import { graphicsCtx, drawTile, loadTileSet, TileSet } from "./graphics"
import backgroundSrc from "./assets/Background/Brown.png"
import terrainSrc from "./assets/Terrain/Terrain (16x16).png"

import pinkIdleSrc from "./assets/Pink Man/Idle (32x32).png"
import pinkRunSrc from "./assets/Pink Man/Run (32x32).png"
import pinkJumpSrc from "./assets/Pink Man/Jump (32x32).png"

import frogIdleSrc from "./assets/Ninja Frog/Idle (32x32).png"
import frogRunSrc from "./assets/Ninja Frog/Run (32x32).png"
import frogJumpSrc from "./assets/Ninja Frog/Jump (32x32).png"

import dudeIdleSrc from "./assets/Mask Dude/Idle (32x32).png"
import dudeRunSrc from "./assets/Mask Dude/Run (32x32).png"
import dudeJumpSrc from "./assets/Mask Dude/Jump (32x32).png"

import guyIdleSrc from "./assets/Virtual Guy/Idle (32x32).png"
import guyRunSrc from "./assets/Virtual Guy/Run (32x32).png"
import guyJumpSrc from "./assets/Virtual Guy/Jump (32x32).png"

import { Controls, GameState, tileMap, Animation } from "./logic"
import { gameInputs } from "./input"
import { PlayerId } from "rune-sdk"

// map the tiles in our map array to a visual tile in the
// pixel frog assets
const TILE_MAPPING: Record<number, number> = {
  1: 122,
}

// The sprite sheets we'll use for the different characters
// and their actions
interface AnimFrames {
  idle: TileSet
  run: TileSet
  jump: TileSet
}

// we'll scale the graphics up by 2 to give that pixelated feel
const SCALE = 2

;(async () => {
  // load all our resources at startup. In this case it's a set of tile sets
  // that are provided by https://pixelfrog-assets.itch.io/pixel-adventure-1
  //
  // It's important we wait for all resources to load before calling
  // Rune.initClient since Rune will show an in-app loading screen
  // until we call initClient. Best practice is to let Rune handle
  // the loading screen.
  const background = await loadTileSet(backgroundSrc, 64, 64)
  const terrain = await loadTileSet(terrainSrc, 16, 16)

  const playerArt: Record<string, AnimFrames> = {
    "pink-man": {
      idle: await loadTileSet(pinkIdleSrc, 32, 32),
      run: await loadTileSet(pinkRunSrc, 32, 32),
      jump: await loadTileSet(pinkJumpSrc, 32, 32),
    },
    "mask-dude": {
      idle: await loadTileSet(dudeIdleSrc, 32, 32),
      run: await loadTileSet(dudeRunSrc, 32, 32),
      jump: await loadTileSet(dudeJumpSrc, 32, 32),
    },
    "ninja-frog": {
      idle: await loadTileSet(frogIdleSrc, 32, 32),
      run: await loadTileSet(frogRunSrc, 32, 32),
      jump: await loadTileSet(frogJumpSrc, 32, 32),
    },
    "virtual-guy": {
      idle: await loadTileSet(guyIdleSrc, 32, 32),
      run: await loadTileSet(guyRunSrc, 32, 32),
      jump: await loadTileSet(guyJumpSrc, 32, 32),
    },
  }

  // the current game state as provided by the Rune SDK. The client
  // should be rendering whatever the current state is. The Rune SDK
  // will manage the updates and resolution of conflict to the state, so
  // we can simply render what it provides.
  let gameState: GameState
  // the ID given by the DusK SDK for the local player. We'll use this
  // to know which of the entities in the game state we should focus the
  // camera on. Player ID is undefined if the local player is a
  // spectator rather than being part of the game
  let myPlayerId: PlayerId | undefined

  // A copy of the last control state we applied to the game state. We
  // don't want to apply changes when the controls haven't changed to
  // reduce whats going over the network
  let lastSentControls: Controls = {
    left: false,
    right: false,
    jump: false,
  }
  // The last time that we sent an action to update the local
  // client's controls. Rune allows us to send actions at
  // up to 10 a second so we don't send a new action if it's
  // not been 1/10th of a second. In a real game you might manage
  // this more carefully and track how many you've sent a second
  // instead.
  let lastActionTime = 0

  // hook to keep the game rendering
  function requestRender(): void {
    requestAnimationFrame(() => {
      gameLoop()
    })
  }

  // this is our core game loop, we'll render to the screen
  // but also determine whether to send an action to update
  // the local player's control state
  function gameLoop(): void {
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
      Rune.actions.controls(lastSentControls)
    }

    // schedule the next game loop
    requestRender()

    // clear the screen
    for (let x = 0; x < graphicsCtx.canvas.width + 64; x += 64) {
      for (let y = 0; y < graphicsCtx.canvas.height + 64; y += 64) {
        drawTile(x, y - (Math.floor(Date.now() / 25) % 64), background, 0)
      }
    }

    graphicsCtx.save()
    graphicsCtx.scale(SCALE, SCALE)
    // center the screen on our player if we have one
    if (myPlayerId) {
      const myPlayer = gameState.players.find((p) => p.playerId === myPlayerId)
      if (myPlayer) {
        graphicsCtx.translate(
          -myPlayer.x + Math.floor(graphicsCtx.canvas.width / 2 / SCALE),
          -myPlayer.y + Math.floor(graphicsCtx.canvas.height / 2 / SCALE)
        )
      }
    }

    for (let x = 0; x < tileMap[0].length; x++) {
      for (let y = 0; y < tileMap.length; y++) {
        if (tileMap[y][x] !== 0) {
          drawTile(x * 16, y * 16, terrain, TILE_MAPPING[tileMap[y][x]])
        }
      }
    }

    // if the Rune SDK has given us a game state then
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
    }
    graphicsCtx.restore()
  }

  // Start the Rune SDK on the client rendering side. This tells the Rune
  // app that we're ready for players to see the game. It's also the hook
  // that lets the Rune SDK update us on changes to game state
  Rune.initClient({
    // notification from Rune that there is a new game state
    onChange: ({ game, yourPlayerId }) => {
      // record the ID of our local player so we can center the camera
      // on that player.
      myPlayerId = yourPlayerId

      // record the current game state for rendering in
      // out core loop
      gameState = game
    },
  })

  // start the core game loop
  requestRender()
})()
