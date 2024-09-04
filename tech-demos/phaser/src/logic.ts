import { DuskClient, PlayerId } from "dusk-games-sdk"
import { physics } from "propel-js"

export const PHYSICS_WIDTH = 480
export const PHYSICS_HEIGHT = 800

export interface GameState {
    world: physics.World
    controls: Record<PlayerId, Controls>
}

export type Controls = {
    left: boolean
    right: boolean
    up: boolean
}

type GameActions = {
    controls: (controls: Controls) => void
}

declare global {
    const Dusk: DuskClient<GameState, GameActions>
}

Dusk.initLogic({
    minPlayers: 1,
    maxPlayers: 4,
    setup: (allPlayerIds) => {
        const initialState: GameState = {
            world: physics.createWorld({ x: 0, y: 800 }),
            controls: {}
        }

        // phasers setup world but in propel-js physics
        physics.addBody(initialState.world, physics.createRectangle(initialState.world, { x: 0 * PHYSICS_WIDTH, y: 0.2 * PHYSICS_HEIGHT }, 0.5 * PHYSICS_WIDTH, 0.05 * PHYSICS_HEIGHT, 0, 1, 0))
        physics.addBody(initialState.world, physics.createRectangle(initialState.world, { x: 0.75 * PHYSICS_WIDTH, y: 0.4 * PHYSICS_HEIGHT }, 0.5 * PHYSICS_WIDTH, 0.05 * PHYSICS_HEIGHT, 0, 1, 0))
        physics.addBody(initialState.world, physics.createRectangle(initialState.world, { x: 0.5 * PHYSICS_WIDTH, y: 0.6 * PHYSICS_HEIGHT }, 0.5 * PHYSICS_WIDTH, 0.05 * PHYSICS_HEIGHT, 0, 1, 0))
        physics.addBody(initialState.world, physics.createRectangle(initialState.world, { x: 0.5 * PHYSICS_WIDTH, y: 0.9 * PHYSICS_HEIGHT }, 1 * PHYSICS_WIDTH, 0.3 * PHYSICS_HEIGHT, 0, 1, 0))

        // create a player body for each player in the game
        for (const playerId of allPlayerIds) {
            const rect = physics.createRectangleShape(initialState.world, { x: 0.5 * PHYSICS_WIDTH, y: 0.5 * PHYSICS_HEIGHT }, 0.1 * PHYSICS_WIDTH, 0.1 * PHYSICS_HEIGHT)
            const footSensor = physics.createRectangleShape(initialState.world, { x: 0.5 * PHYSICS_WIDTH, y: 0.55 * PHYSICS_HEIGHT }, 0.05 * PHYSICS_WIDTH, 0.005 * PHYSICS_HEIGHT, 0, true)
            const player = physics.createRigidBody(initialState.world, { x: 0.5 * PHYSICS_WIDTH, y: 0.5 * PHYSICS_HEIGHT }, 1, 0, 0, [rect, footSensor]) as physics.DynamicRigidBody
            player.fixedRotation = true
            player.data = { player: true, playerId }
            physics.addBody(initialState.world, player)

            initialState.controls[playerId] = {
                left: false,
                right: false,
                up: false
            }
        }

        // create a few stars to play with
        for (let i=0;i<5;i++) {
            const rect = physics.createCircleShape(initialState.world, { x: i * 0.2 * PHYSICS_WIDTH, y: 0.15 * PHYSICS_HEIGHT }, 0.04 * PHYSICS_WIDTH)
            const star = physics.createRigidBody(initialState.world, { x:i * 0.2 * PHYSICS_WIDTH, y: 0.15 * PHYSICS_HEIGHT }, 1, 1, 0, [rect], { star: true }) as physics.DynamicRigidBody
            physics.addBody(initialState.world, star)

        }

        return initialState
    },
    updatesPerSecond: 30,
    reactive: false,
    update: ({ game, allPlayerIds }) => {
        // each loop process the player inputs and adjust velocities of bodies accordingly
        for (const playerId of allPlayerIds) {
            const body = game.world.dynamicBodies.find(b => b.data?.playerId === playerId);
            if (body) {
                if (game.controls[playerId].left && !game.controls[playerId].right) {
                    body.velocity.x = -100;
                } else if (game.controls[playerId].right && !game.controls[playerId].left) {
                    body.velocity.x = 100;
                } else {
                    body.velocity.x = 0;
                }

                // check if we're on the ground
                if (body.shapes[1].sensorColliding) {
                    if (game.controls[playerId].up) {
                        body.velocity.y = -600
                    }
                }
            } else {
                console.log("Body not found")
            }
        }

        // propel-js likes a 60fps game loop since it keeps the iterations high so run it
        // twice since the game logic is configured to run at 30fps
        physics.worldStep(60, game.world)
        physics.worldStep(60, game.world)

    },
    actions: {
        controls: (controls, { game, playerId }) => {
            game.controls[playerId] = controls
        },
    },
})
