import Phaser from "phaser";
import { physics } from "propel-js"
import { Controls, PHYSICS_HEIGHT, PHYSICS_WIDTH } from "./logic";

// Based off: https://phaser.io/tutorials/making-your-first-phaser-3-game/part1

const gameInputs: Controls = {
    left: false,
    right: false,
    up: false
}

const touchDevice = "ontouchstart" in document.documentElement
const left = document.getElementById("left") as HTMLImageElement
const right = document.getElementById("right") as HTMLImageElement
const jump = document.getElementById("jump") as HTMLImageElement

// if we're testing on a touch device then use touchstart/touchmove/touchend.
// we're being a bit idealistic here and only considering the first touch.
if (touchDevice) {
  left.addEventListener("touchstart", () => {
    gameInputs.left = true
  })
  right.addEventListener("touchstart", () => {
    gameInputs.right = true
  })
  left.addEventListener("touchend", () => {
    gameInputs.left = false
  })
  right.addEventListener("touchend", () => {
    gameInputs.right = false
  })
  jump.addEventListener("touchstart", () => {
    gameInputs.up = true
  })
  jump.addEventListener("touchend", () => {
    gameInputs.up = false
  })
} else {
    left.addEventListener("mousedown", () => {
      gameInputs.left = true
    })
    right.addEventListener("mousedown", () => {
      gameInputs.right = true
    })
    jump.addEventListener("mousedown", () => {
      gameInputs.up = true
    })
    window.addEventListener("mouseup", () => {
      gameInputs.left = false
      gameInputs.right = false
      gameInputs.up = false
    })
}

export default class TutorialGame extends Phaser.Scene {
    physicsToPhaser: Record<number, Phaser.GameObjects.Sprite> = {};
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    lastSentControls: Controls = {
        left: false,
        right: false,
        up: false
    }
    
    preload() {
        // preload our assets with phaser
        this.load.image('sky', 'assets/sky.png')
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.add.image(400, 300, 'sky').setScale(1, 3)

        // since we're now in a shared world the physics can't run on the client
        // side so we're going to move it all into the shared logic file so it'll
        // run client and server side and be synchronized. 
        //
        // For phaser this means instead of relying the arcade physics in the library
        // we'll use it for rendering and synchronize the position of sprites to the
        // bodies that run on the server.
        //
        // Unfortunately Phaser's physics system isn't something that can be easily
        // serialized so we'll use propel-js instead to manage physics
        Dusk.initClient({
            onChange: ({ game }) => {
                // for all the bodies in the game, make sure the visual representation
                // exists and is synchornized with the physics running in the game logic
                for (const body of physics.allBodies(game.world)) {
                    const rect = body.shapes[0] as physics.Rectangle;

                    const x = Math.ceil(body.center.x / PHYSICS_WIDTH * window.innerWidth)
                    const y = Math.ceil(body.center.y / PHYSICS_HEIGHT * window.innerHeight)
                    const width = Math.ceil(rect.width / PHYSICS_WIDTH * window.innerWidth)
                    const height = Math.ceil(rect.height / PHYSICS_HEIGHT * window.innerHeight)

                    let sprite = this.physicsToPhaser[body.id];
                    
                    // if a sprite isn't already created, create one based on the type
                    // of body 
                    if (!sprite) {
                        if (body.data && body.data.star) {
                            const size = Math.ceil(rect.bounds / PHYSICS_WIDTH * window.innerWidth)
                            sprite = this.physicsToPhaser[body.id] =
                            this.add.sprite(x, y, "star").setDisplaySize(size * 2, size * 2)
                        } else if (body.data && body.data.player) {
                            // create the player and associated animations
                            sprite = this.physicsToPhaser[body.id] =
                                this.add.sprite(x, y, "dude").setDisplaySize(width, height)

                            this.anims.create({
                                key: 'left',
                                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                                frameRate: 10,
                                repeat: -1
                            });

                            this.anims.create({
                                key: 'turn',
                                frames: [{ key: 'dude', frame: 4 }],
                                frameRate: 20
                            });

                            this.anims.create({
                                key: 'right',
                                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                                frameRate: 10,
                                repeat: -1
                            });
                        } else {
                            sprite = this.physicsToPhaser[body.id] =
                                this.add.sprite(x, y, "ground").setDisplaySize(width, height)
                        }
                    }

                    // update the sprites position and if its a player the animation
                    sprite.x = x;
                    sprite.y = y;
                    if (body.data?.player) {
                        const controls = game.controls[body.data?.playerId ?? ""]
                        if (controls) {
                            if (controls.left) {
                                sprite.anims.play('left', true);
                            } else if (controls.right) {
                                sprite.anims.play('right', true);
                            } else {
                                sprite.anims.play('turn', true);
                            }
                        }
                    }
                }
            },
        })
    }

    update() {
        // As with the physics we don't want the controls to be processed directly in the
        // the client code. Instead we want to schedule an action immediately that will update
        // the game logic (and in turn the physics engine) with the new state of the player's
        // controls.
        //
        // Using keyboard here but we'll also do on screen controls. Note that we don't 
        // want to send the action too often so we don't block the network - we'll only
        // send an action when the controls actually change
        if (this.cursors) {
            const stateLeft = (this.cursors?.left.isDown ?? false) || gameInputs.left;
            const stateRight = (this.cursors?.right.isDown ?? false) || gameInputs.right;
            const stateUp = (this.cursors?.up.isDown ?? false) || gameInputs.up;

            if (this.lastSentControls.left !== stateLeft ||
                this.lastSentControls.right !== stateRight ||
                this.lastSentControls.up !== stateUp) {
                    this.lastSentControls = { 
                        left: stateLeft,
                        right: stateRight,
                        up: stateUp,
                    }
                    Dusk.actions.controls(this.lastSentControls)
            }
        }
    }

}

// Standard phaser boilerplate
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: TutorialGame,
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT
    }
};

new Phaser.Game(config);
