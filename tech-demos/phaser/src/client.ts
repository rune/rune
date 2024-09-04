import Phaser from "phaser";
import { physics } from "propel-js";
import { Controls, PHYSICS_HEIGHT, PHYSICS_WIDTH } from "./logic";

export default class TutorialGame extends Phaser.Scene {
    physicsToPhaser: Record<number, Phaser.GameObjects.Sprite> = {};
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    lastSentControls: Controls = {
        left: false,
        right: false,
        up: false
    }
    
    preload() {
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

        Dusk.initClient({
            onChange: ({ game }) => {
                for (const body of physics.allBodies(game.world)) {
                    const rect = body.shapes[0] as physics.Rectangle;

                    const x = Math.ceil(body.center.x / PHYSICS_WIDTH * window.innerWidth)
                    const y = Math.ceil(body.center.y / PHYSICS_HEIGHT * window.innerHeight)
                    const width = Math.ceil(rect.width / PHYSICS_WIDTH * window.innerWidth)
                    const height = Math.round(rect.height / PHYSICS_HEIGHT * window.innerHeight)

                    let sprite = this.physicsToPhaser[body.id];
                    if (!sprite) {
                        if (body.data && body.data.star) {
                            sprite = this.physicsToPhaser[body.id] =
                            this.add.sprite(x, y, "star").setDisplaySize(width, height)
                        } else if (body.data && body.data.player) {
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
        if (this.cursors) {
            if (this.lastSentControls.left !== (this.cursors?.left.isDown ?? false) ||
                this.lastSentControls.right !== (this.cursors?.right.isDown ?? false) ||
                this.lastSentControls.up !== (this.cursors?.up.isDown ?? false)) {
                    this.lastSentControls = { 
                        left: this.cursors?.left.isDown ?? false,
                        right: this.cursors?.right.isDown ?? false,
                        up: this.cursors?.up.isDown ?? false,
                    }
                    Dusk.actions.controls(this.lastSentControls)
            }
        }
    }

}

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
