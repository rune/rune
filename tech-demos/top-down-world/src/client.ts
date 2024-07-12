import { graphicsCtx, drawTile, loadTileSet } from "./graphics";
import tileSetElevationSrc from "./assets/Tilemap_Elevation.png";
import tileSetFlatSrc from "./assets/Tilemap_Flat.png";
import tileSetTreeSrc from "./assets/Tree.png";
import warriorBlueSrc from "./assets/Warrior_Blue.png";
import warriorPurpleSrc from "./assets/Warrior_Purple.png";
import warriorRedSrc from "./assets/Warrior_Red.png";
import warriorYellowSrc from "./assets/Warrior_Yellow.png";
import { GameState, Player, tileMap as gameMap } from "./logic";
import { Controls, gameInputs } from "./input";
import { PlayerId } from "dusk-games-sdk";

const tileSetElevation = await loadTileSet(tileSetElevationSrc, 64, 64);
const tileSetFlat = await loadTileSet(tileSetFlatSrc, 64, 64);
const tileSetTree = await loadTileSet(tileSetTreeSrc, 192, 192);
const warriorBlue = await loadTileSet(warriorBlueSrc, 192, 192);
const warriorPurple = await loadTileSet(warriorPurpleSrc, 192, 192);
const warriorRed = await loadTileSet(warriorRedSrc, 192, 192);
const warriorYellow = await loadTileSet(warriorYellowSrc, 192, 192);

const entitySprites = [warriorBlue, warriorPurple, warriorRed, warriorYellow, tileSetTree];
const playerFootPosition = [96, 125];
const treeFootPosition = [95, 170];

let gameState: GameState;
let myPlayerId: PlayerId | undefined;

let lastSentControls: Controls = {
  left: false,
  right: false,
  down: false,
  up: false
};
let lastActionTime: number = 0;

function requestRender(): void {
  requestAnimationFrame(() => {
    render();
  })
}

function render(): void {
  // we're only allowed to update the controls 10 times a second, so 
  // only send if its been 1/10 of a second since we sent the last one
  // and the controls have changed
  if ((Date.now() - lastActionTime > 100) &&
     (gameInputs.left !== lastSentControls.left ||
      gameInputs.right !== lastSentControls.right ||
      gameInputs.up !== lastSentControls.up ||
      gameInputs.down !== lastSentControls.down
    )) {
    lastSentControls = { ...gameInputs };
    lastActionTime = Date.now();
    Dusk.actions.controls(lastSentControls);
  }


  requestRender();

  graphicsCtx.save();
  graphicsCtx.fillStyle = "#409c9b";
  graphicsCtx.fillRect(0, 0, graphicsCtx.canvas.width, graphicsCtx.canvas.height);

  if (myPlayerId) {
    const myPlayer = gameState.entities.find(p => p.playerId === myPlayerId);
    if (myPlayer) {
      graphicsCtx.translate(-myPlayer.x + Math.floor(graphicsCtx.canvas.width / 2), -myPlayer.y + Math.floor(graphicsCtx.canvas.height / 2));
    }
  }

  for (let y = gameMap.length - 1; y >= 0; y--) {
    const row = gameMap[y];
    for (let x = 0; x < row.length; x++) {
      const tile = row[x];

      // draw the rocks beneath
      if (tile >= 20) {
        const offset = tile - 20;
        drawTile(x * 64, y * 64, tileSetElevation, 16 + offset);
        drawTile(x * 64, (y + 1) * 64, tileSetElevation, 20 + offset);
        if (y === gameMap.length - 1) {
          drawTile(x * 64, (y + 2) * 64, tileSetElevation, 24 + offset);
        }
      }
      drawTile(x * 64, y * 64, tileSetFlat, tile);
    }
  }

  if (gameState) {
    const frame = Math.floor(Dusk.gameTime() / 100) % 6;
    [...gameState.entities].sort((a, b) => a.y - b.y).forEach((entity) => {
      if (entity.type === "PLAYER") {
        const player = entity as Player;
        drawTile(player.x - playerFootPosition[0], player.y - playerFootPosition[1], entitySprites[player.sprite], player.animation + frame, player.flipped);
      } else {
        drawTile(entity.x - treeFootPosition[0], entity.y - treeFootPosition[1], entitySprites[entity.sprite], 0);
      }
    });
  }

  graphicsCtx.restore();
}

Dusk.initClient({
  onChange: ({ game, yourPlayerId, action }) => {
    myPlayerId = yourPlayerId;
    gameState = game;
  },
})

// start the rendering loop
requestRender();
