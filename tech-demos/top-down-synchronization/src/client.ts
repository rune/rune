import { graphicsCtx, drawTile, loadTileSet } from "./graphics"
import tileSetElevationSrc from "./assets/Tilemap_Elevation.png"
import tileSetFlatSrc from "./assets/Tilemap_Flat.png"
import tileSetTreeSrc from "./assets/Tree.png"
import warriorBlueSrc from "./assets/Warrior_Blue.png"
import warriorPurpleSrc from "./assets/Warrior_Purple.png"
import warriorRedSrc from "./assets/Warrior_Red.png"
import warriorYellowSrc from "./assets/Warrior_Yellow.png"
import { Controls, GameState, Player, tileMap as gameMap } from "./logic"
import { PlayerId } from "dusk-games-sdk"
import { gameInputs } from "./input"
;(async () => {
  // load all our resources at startup. In this case it's a set of tile sets
  // that are provided by https://pixelfrog-assets.itch.io/tiny-swords
  //
  // It's important we wait for all resources to load before calling
  // Dusk.initClient since Dusk will show an in-app loading screen
  // until we call initClient. Best practice is to let Dusk handle
  // the loading screen.
  const tileSetElevation = await loadTileSet(tileSetElevationSrc, 64, 64)
  const tileSetFlat = await loadTileSet(tileSetFlatSrc, 64, 64)
  const tileSetTree = await loadTileSet(tileSetTreeSrc, 192, 192)
  const warriorBlue = await loadTileSet(warriorBlueSrc, 192, 192)
  const warriorPurple = await loadTileSet(warriorPurpleSrc, 192, 192)
  const warriorRed = await loadTileSet(warriorRedSrc, 192, 192)
  const warriorYellow = await loadTileSet(warriorYellowSrc, 192, 192)

  const startTime = Date.now()

  // indexed sprites to let different players have different colored warriors
  const entitySprites = [
    warriorBlue,
    warriorPurple,
    warriorRed,
    warriorYellow,
    tileSetTree,
  ]

  // Positions in the sprite of the base of the character/tree. This lets us position
  // sprites correctly based on their world location and makes the
  // z-sorting for depth work well.
  const playerFootPosition = [96, 125]
  const treeFootPosition = [95, 170]

  // the current game state as provided by the Dusk SDK. The client
  // should be rendering whatever the current state is. The Dusk SDK
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
    down: false,
    up: false,
  }
  // The last time that we sent an action to update the local
  // client's controls. Dusk allows us to send actions at
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
        gameInputs.up !== lastSentControls.up ||
        gameInputs.down !== lastSentControls.down)
    ) {
      lastSentControls = { ...gameInputs }
      lastActionTime = Date.now()
      Dusk.actions.controls(lastSentControls)
    }

    // schedule the next game loop
    requestRender()

    // clear the screen
    graphicsCtx.save()
    graphicsCtx.fillStyle = "#409c9b"
    graphicsCtx.fillRect(
      0,
      0,
      graphicsCtx.canvas.width,
      graphicsCtx.canvas.height
    )

    // center the screen on our player if we have one
    if (myPlayerId) {
      const myPlayer = gameState.entities.find((p) => p.playerId === myPlayerId)
      if (myPlayer) {
        graphicsCtx.translate(
          -myPlayer.x + Math.floor(graphicsCtx.canvas.width / 2),
          -myPlayer.y + Math.floor(graphicsCtx.canvas.height / 2)
        )
      }
    }

    // render the tile map ground.
    for (let y = gameMap.length - 1; y >= 0; y--) {
      const row = gameMap[y]
      for (let x = 0; x < row.length; x++) {
        const tile = row[x]

        // draw the rocks beneath the bottom of the
        // the map to give the look of depth
        if (tile >= 20) {
          const offset = tile - 20
          drawTile(x * 64, y * 64, tileSetElevation, 16 + offset)
          drawTile(x * 64, (y + 1) * 64, tileSetElevation, 20 + offset)
          // if we're right at the bottom of the map then draw in
          // the waves to tidy up the bottom edge
          if (y === gameMap.length - 1 || gameMap[y + 1][x] === -1) {
            drawTile(x * 64, (y + 2) * 64, tileSetElevation, 24 + offset)
          }
        }
        drawTile(x * 64, y * 64, tileSetFlat, tile)
      }
    }

    // if the Dusk SDK has given us a game state then
    // render all the entities in the game
    if (gameState) {
      const frame = Math.floor((Date.now() - startTime) / 100) % 6

      // render all the entities based on the current game state
      ;[...gameState.entities]
        .sort((a, b) => a.y - b.y)
        .forEach((entity) => {
          if (entity.type === "PLAYER") {
            // players need to be rendering using animation and flipping
            const player = entity as Player
            drawTile(
              player.x - playerFootPosition[0],
              player.y - playerFootPosition[1],
              entitySprites[player.sprite],
              player.animation + frame,
              player.flipped
            )
          } else {
            // other entities (only trees) can be rendering with no animation or flipping
            drawTile(
              entity.x - treeFootPosition[0],
              entity.y - treeFootPosition[1],
              entitySprites[entity.sprite],
              0
            )
          }
        })
    }

    graphicsCtx.restore()
  }

  // Start the Dusk SDK on the client rendering side. This tells the Dusk
  // app that we're ready for players to see the game. It's also the hook
  // that lets the Dusk SDK update us on changes to game state
  Dusk.initClient({
    // notification from Dusk that there is a new game state
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
