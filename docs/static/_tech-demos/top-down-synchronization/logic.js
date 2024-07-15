const MOVE_SPEED = 4;
const tileMap = [
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
  [-1, -1, -1, -1, -1, 20, 22, -1, -1, -1, -1, -1]
];
const trees = [
  [200, 50],
  [300, 120],
  [50, 200],
  [80, 400],
  [500, 100],
  [480, 300],
  [550, 200],
  [300, 400],
  [700, 450]
];
function isValidPosition(state, x, y) {
  x = Math.floor(x / 64);
  y = Math.floor(y / 64);
  return tileMap[y] && tileMap[y][x] >= 0;
}
Dusk.initLogic({
  // number of players to allow in the game
  minPlayers: 1,
  maxPlayers: 4,
  // this is the initialization function where
  // we setup the initial game state before any player has
  // a chance to modify it. The initial state is sent to
  // all players to start the game
  setup: (allPlayerIds) => {
    const initialState = {
      // for each of the players Dusk says are in the game
      // create a new player entity. We'll initialize their
      // location to place them in the world
      entities: allPlayerIds.map((p, index) => {
        return {
          x: (index + 1) * 64,
          y: (index + 1) * 64,
          playerId: p,
          type: "PLAYER",
          // make the player have a different sprite color
          // based on their index in the player array. This is
          // a very simple approach for the purposes of a
          // tech demo
          sprite: index % 4,
          animation: 0,
          controls: {
            left: false,
            right: false,
            up: false,
            down: false
          }
        };
      })
    };
    for (const tree of trees) {
      initialState.entities.push({
        type: "TREE",
        x: tree[0],
        y: tree[1],
        sprite: 4
      });
    }
    return initialState;
  },
  // the number of updates per second the game logic is going to run out. In most
  // cases this doesn't need to be as high as 30 but for the purposes of the
  // tech mode we'll just use the maximum
  updatesPerSecond: 30,
  // the update loop where we progress the game based on the current player inputs
  // that have been sent through actions.
  update: ({ game }) => {
    for (const entity of game.entities.filter((e) => e.type === "PLAYER")) {
      const player = entity;
      player.animation = 0;
      if (player.controls.left) {
        if (isValidPosition(game, player.x - MOVE_SPEED, player.y)) {
          player.x -= MOVE_SPEED;
          player.animation = 7;
          player.flipped = true;
        }
      }
      if (player.controls.right) {
        if (isValidPosition(game, player.x + MOVE_SPEED, player.y)) {
          player.x += MOVE_SPEED;
          player.animation = 7;
          player.flipped = false;
        }
      }
      if (player.controls.up) {
        if (isValidPosition(game, player.x, player.y - MOVE_SPEED)) {
          player.y -= MOVE_SPEED;
          player.animation = 7;
        }
      }
      if (player.controls.down) {
        if (isValidPosition(game, player.x, player.y + MOVE_SPEED)) {
          player.y += MOVE_SPEED;
          player.animation = 7;
        }
      }
    }
  },
  // actions are the way clients can modify game state. Dusk manages
  // how and when these actions are applied to maintain a consistent
  // game state between all clients.
  actions: {
    // Action applied from the client to setup the controls the
    // player is currently pressing. We simple record the controls
    // and let the update() loop actually apply the changes
    controls: (controls, { game, playerId }) => {
      const entity = game.entities.find((p) => p.playerId === playerId);
      if (entity && entity.type === "PLAYER") {
        entity.controls = { ...controls };
      }
    }
  }
});
export {
  tileMap as t
};
