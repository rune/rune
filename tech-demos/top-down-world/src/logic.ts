import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"
import { Controls } from "./input";

export const MOVE_SPEED = 4;

export const tileMap = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [20, 21, 21, 21, 21, 11, 11, 21, 21, 21, 21, 22],
  [-1, -1, -1, -1, -1, 10, 12, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, 20, 22, -1, -1, -1, -1, -1],
]

export const trees = [
  [200, 50], [300,120], [50, 200], [80, 400], [500, 100], [480, 300], [550, 200], [300, 400], [700, 450]
]
export type EntityType = "PLAYER" | "TREE";
export enum Animation {
  IDLE = 0,
  WALK = 7,
}

export type Entity = {
  x: number;
  y: number;
  sprite: number;
  type: EntityType;
  playerId?: PlayerId;
}

export type Player = {
  controls: Controls;
  animation: Animation;
  flipped: boolean;
} & Entity;

export interface GameState {
  entities: Entity[];
}

type GameActions = {
  controls: (controls: Controls) => void
}

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

function isValidPosition(state: GameState, x: number, y: number): boolean {
  x = Math.floor(x / 64);
  y = Math.floor(y / 64);

  return tileMap[y] && tileMap[y][x] >= 0;
}

Dusk.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const initialState: GameState = {
      entities: allPlayerIds.map((p, index) => {
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
            down: false
          }
        }
      })
    }

    // add some trees
    for (const tree of trees) {
      initialState.entities.push({
        type: "TREE",
        x: tree[0],
        y: tree[1],
        sprite: 4
      })
    }
    
    return initialState;
  },
  updatesPerSecond: 30,
  update: ({ game }) => {
    for (const entity of game.entities.filter(e => e.type === "PLAYER")) {
      const player = entity as Player;
      player.animation = Animation.IDLE;
      if (player.controls.left) {
        if (isValidPosition(game, player.x - MOVE_SPEED, player.y)) {
          player.x -= MOVE_SPEED;
          player.animation = Animation.WALK;
          player.flipped = true;
        }
      }
      if (player.controls.right) {
        if (isValidPosition(game, player.x + MOVE_SPEED, player.y)) {
          player.x += MOVE_SPEED;
          player.animation = Animation.WALK;
          player.flipped = false;
        }
      }
      if (player.controls.up) {
        if (isValidPosition(game, player.x, player.y - MOVE_SPEED)) {
          player.y -= MOVE_SPEED;
          player.animation = Animation.WALK;
        }
      }
      if (player.controls.down) {
        if (isValidPosition(game, player.x, player.y + MOVE_SPEED)) {
          player.y += MOVE_SPEED;
          player.animation = Animation.WALK;
        }
      }
    }
  },
  actions: {
    controls: (controls, { game, playerId, allPlayerIds }) => {
      const entity = game.entities.find(p => p.playerId === playerId);
      if (entity && entity.type === "PLAYER") {
        (entity as Player).controls = { ...controls };
      }
    },
  },
})
