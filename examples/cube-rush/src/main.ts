import { Interpolator, InterpolatorLatency, Players } from "rune-games-sdk"
import { PlayerId } from "rune-games-sdk/multiplayer"
import * as THREE from "three"
// eslint-disable-next-line
// @ts-ignore
import { Text } from "troika-three-text"
import {
  BloomEffect,
  EffectPass,
  EffectComposer,
  RenderPass,
} from "postprocessing"

import "./index.css"
import { createCube } from "./cube"
import { createFinishLine, createGroundPlane, createWall } from "./bounders"
import { GameState } from "./logic"
import {
  COUNTDOWN_MS,
  TRACK_DISTANCE,
  AVATAR_WIDTH,
  SHIP_HEIGHT,
  COMPLETED_PLAYER_START_SPECTATING_MS,
} from "./config"
import { createShipLabel, createShip } from "./ship"

// UI
/* Start Screen */
const uiPausedScreen = document.getElementById("pausedScreen")!
const uiStartBtn = uiPausedScreen.getElementsByClassName("startBtn")[0]!

/* Countdown Screen */
const uiCountdownScreen = document.getElementById("countdownScreen")!
const uiCountdown = uiCountdownScreen.getElementsByClassName("countdown")[0]!

/* Playing Screen */
const uiPlayingScreen = document.getElementById("playingScreen")!
const uiInfo = document.getElementById("info")!
const uiPlace = uiInfo.getElementsByClassName("place")[0]!
const uiSpeed = uiInfo.getElementsByClassName("speed")[0]!

const uiTrackProgress = uiInfo.getElementsByClassName("trackProgressTrack")[0]!
const uiSpectating = uiInfo.getElementsByClassName(
  "spectating",
)[0]! as HTMLElement
const uiSpectatingDisplayName =
  uiSpectating.getElementsByClassName("displayName")[0]!
const uiSpectatingAvatar = uiSpectating.getElementsByClassName(
  "avatar",
)[0]! as HTMLImageElement

const uiStats = document.getElementById("stats")!
const uiStatsPlace = uiStats.getElementsByClassName("place")[0]!
const uiStatsTopSpeed = uiStats.getElementsByClassName("topSpeed")[0]!
const uiStatsElapse = uiStats.getElementsByClassName("elapse")[0]!

const uiControlsPreview = uiPlayingScreen.getElementsByClassName(
  "controlsPreview",
)[0]! as HTMLElement

let game: GameState
let players: Players
let yourPlayerId: PlayerId | undefined

let isSetup = false

const playerInterpolator = Rune.interpolator<[number, number, number]>()
let opponentInterpolators: Record<
  PlayerId,
  {
    x: InterpolatorLatency<number>
    z: Interpolator<number>
    r: Interpolator<number>
  }
> = {}

Rune.initClient({
  onChange: (params) => {
    game = params.game
    players = params.players
    yourPlayerId = params.yourPlayerId

    if (!isSetup) {
      isSetup = true

      initControls()
      initRender()
      animate() // start game loop
    }

    if (params.event?.name === "stateSync") {
      initPlayers()
      initCubes()
      initSpectating()

      opponentInterpolators = {}
      Object.keys(players).forEach((playerId) => {
        if (playerId !== yourPlayerId) {
          opponentInterpolators[playerId] = {
            x: Rune.interpolatorLatency<number>({
              maxSpeed: 0.06,
              timeToMaxSpeed: 1500,
            }),
            z: Rune.interpolator<number>(),
            r: Rune.interpolator<number>(),
          }
        }
      })
    } else if (params.event?.name === "playerLeft") {
      handlePlayerLeft(params.event.params.playerId)
    }

    if (yourPlayerId) {
      playerInterpolator.update({
        game: [
          params.game.ships[yourPlayerId].position.x,
          params.game.ships[yourPlayerId].position.z,
          params.game.ships[yourPlayerId].rotation.z,
        ],
        futureGame: [
          params.futureGame!.ships[yourPlayerId].position.x,
          params.futureGame!.ships[yourPlayerId].position.z,
          params.futureGame!.ships[yourPlayerId].rotation.z,
        ],
      })
    }

    Object.keys(players).forEach((playerId) => {
      if (playerId !== yourPlayerId) {
        opponentInterpolators[playerId].z.update({
          game: params.game.ships[playerId].position.z,
          futureGame: params.futureGame!.ships[playerId].position.z,
        })

        opponentInterpolators[playerId].x.update({
          game: params.game.ships[playerId].position.x,
          futureGame: params.futureGame!.ships[playerId].position.x,
        })

        opponentInterpolators[playerId].r.update({
          game: params.game.ships[playerId].rotation.z,
          futureGame: params.futureGame!.ships[playerId].rotation.z,
        })
      }
    })
  },
})

let scene: THREE.Scene
let camera: THREE.Camera
let renderer: THREE.WebGLRenderer
let composer: EffectComposer
const cubes: ReturnType<typeof createCube>[] = []
let playerThreeObjs: Record<
  PlayerId,
  {
    ship: THREE.Mesh
    displayName: Text
    avatar: THREE.Mesh
  }
> = {}
let playerHtmlObjs: Record<PlayerId, { avatar: HTMLImageElement }> = {}
let spectatingPlayerId: PlayerId | undefined

// INIT HELPERS
function initControls() {
  uiStartBtn.addEventListener("click", () => {
    Rune.actions.switchPhase("COUNTDOWN")
  })

  window.addEventListener("resize", (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    camera.aspect = window.innerWidth / window.innerHeight
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    camera.updateProjectionMatrix()
  })

  window.addEventListener("pointerdown", (event) => {
    if (game.phase !== "PLAYING") return
    if (spectatingPlayerId) {
      spectatingPlayerId = getNextSpectatingPlayerId()
      return
    }
    if (!yourPlayerId) return

    if (game.completedPlayers[yourPlayerId]) return

    const isLeft = event.clientX / window.innerWidth < 0.5

    Rune.actions.setShipDirection(isLeft ? "left" : "right")
  })

  window.addEventListener("pointerup", (event) => {
    if (game.phase !== "PLAYING") return
    if (!yourPlayerId) {
      // Ignore because handled in pointerdown already
      return
    }
    if (game.completedPlayers[yourPlayerId]) return

    Rune.actions.setShipDirection(null)
  })
}

function initRender() {
  // Viewport
  const width = window.innerWidth
  const height = window.innerHeight

  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0b1042, 15, 30)

  // Renderer
  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: false,
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(width, height)
  document.body.appendChild(renderer.domElement)
  const ambient = new THREE.AmbientLight(0xffffff)
  scene.add(ambient)

  // Camera
  camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 100)
  camera.position.set(0, 0.25, 2.0)

  // Objects
  createGroundPlane(scene)
  createWall("left", scene)
  createWall("right", scene)
  createFinishLine(scene)

  // Create Cubes
  game.cubes.forEach((cube, idx) => {
    cubes[idx] = createCube(scene, cube.colorIdx)
  })

  // Directional Light
  let light: THREE.DirectionalLight | null = null
  light = new THREE.DirectionalLight(0xfffff, 1)
  light.position.set(0.1, 0.1, 0)
  light.target.position.set(0, 0, -1)
  scene.add(light)

  // Composer with Postprocessing
  composer = new EffectComposer(renderer)

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomEffect = new BloomEffect({
    intensity: 0.8,
    radius: 1,
    luminanceThreshold: 0.08,
  })
  composer.addPass(new EffectPass(camera, bloomEffect))
}

function initPlayers() {
  Object.values(playerThreeObjs).forEach((obj) => {
    scene.remove(obj.ship)
    scene.remove(obj.displayName)
    obj.displayName.dispose()
    scene.remove(obj.avatar)
  })
  playerThreeObjs = {}

  Object.values(playerHtmlObjs).forEach((obj) => {
    obj.avatar.remove()
  })
  playerHtmlObjs = {}

  uiTrackProgress.innerHTML = ""
  uiSpectating.style.visibility = "hidden"

  Object.keys(players).forEach((playerId, idx) => {
    const ship = createShip(scene, idx)
    const { displayNameObj, avatarObj } = createShipLabel(
      scene,
      players[playerId].displayName,
      players[playerId].avatarUrl,
    )
    playerThreeObjs[playerId] = {
      ship,
      displayName: displayNameObj,
      avatar: avatarObj,
    }

    // Set players in progress
    const avatarHtml = document.createElement("img")
    avatarHtml.src = players[playerId].avatarUrl

    uiTrackProgress.append(avatarHtml)
    playerHtmlObjs[playerId] = { avatar: avatarHtml }
  })
}

function initCubes() {
  game.cubes.forEach((cube, idx) => {
    cubes[idx].set(cube.x, cube.z, cube.colorIdx)
  })
}

function initSpectating() {
  if (!yourPlayerId) {
    spectatingPlayerId = getNextSpectatingPlayerId()
  } else {
    spectatingPlayerId = undefined
  }
}

// ANIMATE GAME LOOP
function animate() {
  requestAnimationFrame(animate)

  if (
    Object.keys(playerThreeObjs).length === 0 ||
    Object.keys(playerHtmlObjs).length === 0
  ) {
    return
  }

  const isGameOver =
    Object.keys(game.completedPlayers).length == Object.keys(players).length

  // Render from perspective of your player or player you are spectating
  // If player has completed then start spectating after some time
  // On game over, start spectating right away
  let attachedToPlayerId: PlayerId
  if (
    yourPlayerId &&
    (Rune.gameTime() >
      game.completedPlayers[yourPlayerId]?.elapse +
        COMPLETED_PLAYER_START_SPECTATING_MS ||
      isGameOver)
  ) {
    // Initially, do not spectate yourself
    spectatingPlayerId =
      spectatingPlayerId ??
      getNextSpectatingPlayerId(yourPlayerId) ??
      yourPlayerId
    attachedToPlayerId = spectatingPlayerId
  } else {
    attachedToPlayerId =
      yourPlayerId ?? spectatingPlayerId ?? getNextSpectatingPlayerId()
  }

  // Update based on phase
  if (game.phase === "PAUSED") {
    // Choose screen
    uiPausedScreen.style.visibility = "visible"
    uiCountdownScreen.style.visibility = "hidden"
    uiPlayingScreen.style.visibility = "hidden"

    // Blur render
    renderer.domElement.style.filter = "blur(5px)"
  } else if (game.phase === "COUNTDOWN") {
    // Choose screen
    uiPausedScreen.style.visibility = "hidden"
    uiCountdownScreen.style.visibility = "visible"
    uiPlayingScreen.style.visibility = "hidden"

    // Blur render
    renderer.domElement.style.filter = "blur(5px)"

    // Countdown
    if (game.startedAt) {
      const leftSeconds = Math.ceil(
        (COUNTDOWN_MS - (Rune.gameTime() - game.startedAt)) / 1000,
      )
      uiCountdown.textContent = leftSeconds.toFixed(0)
    }
  } else if (game.phase === "PLAYING") {
    // Choose screen
    uiPausedScreen.style.visibility = "hidden"
    uiCountdownScreen.style.visibility = "hidden"
    uiPlayingScreen.style.visibility = "visible"

    // Blur render
    renderer.domElement.style.filter = "blur(0px)"

    // Info
    const place = getPlace(attachedToPlayerId)
    const renderedPlace = renderPlace(place)
    uiPlace.innerHTML = renderedPlace

    const zSpeed = game.ships[attachedToPlayerId].zSpeed
    uiSpeed.textContent = renderSpeed(zSpeed)

    // Spectating
    if (spectatingPlayerId) {
      uiSpectating.style.visibility = "visible"
      const player = players[attachedToPlayerId]
      uiSpectatingDisplayName.textContent = player.displayName
      uiSpectatingAvatar.src = player.avatarUrl
    }

    // Stats (except for the last player)
    const yourCompletedPlayer =
      yourPlayerId && game.completedPlayers[yourPlayerId]
    if (!spectatingPlayerId && yourPlayerId && yourCompletedPlayer) {
      uiStatsPlace.innerHTML = renderedPlace // use the same as in Info

      const topZSpeed = game.ships[yourPlayerId].topZSpeed
      uiStatsTopSpeed.textContent = renderSpeed(topZSpeed)

      const elapse = yourCompletedPlayer.elapse
      uiStatsElapse.textContent = renderElapse(elapse)

      uiStats.classList.add("visible")
    } else {
      uiStats.classList.remove("visible")
    }

    // Show controls only while playing
    if (yourPlayerId && !yourCompletedPlayer) {
      uiControlsPreview.style.visibility = "visible"
    } else {
      uiControlsPreview.style.visibility = "hidden"
    }
  }

  // Players
  Object.keys(playerThreeObjs).forEach((playerId) => {
    const { ship, displayName, avatar } = playerThreeObjs[playerId]
    if (playerId === yourPlayerId) {
      const position = playerInterpolator.getPosition()

      ship.position.x = position[0]
      ship.position.z = position[1]
      ship.rotation.z = position[2]
    } else {
      ship.position.x = opponentInterpolators[playerId].x.getPosition()
      ship.position.z = opponentInterpolators[playerId].z.getPosition()
      ship.rotation.z = opponentInterpolators[playerId].r.getPosition()
    }

    // Render trackProgress
    const uiAvatar = playerHtmlObjs[playerId].avatar
    if (uiAvatar) {
      const progress = -ship.position.z / TRACK_DISTANCE
      uiAvatar.style.left = `calc(${progress * 100}% - ${AVATAR_WIDTH / 2}rem)`
    }

    // Render displayName for others
    if (playerId !== attachedToPlayerId) {
      displayName.position.x = ship.position.x
      displayName.position.y = ship.position.y + SHIP_HEIGHT + 0.03
      displayName.position.z = ship.position.z

      avatar.position.x = ship.position.x
      avatar.position.y = ship.position.y + SHIP_HEIGHT + 0.03 + 0.03
      avatar.position.z = ship.position.z
    } else {
      displayName.position.y = -1
      avatar.position.y = -1
    }
  })

  // Camera position
  camera.position.x = playerThreeObjs[attachedToPlayerId].ship.position.x
  camera.position.z = playerThreeObjs[attachedToPlayerId].ship.position.z + 2.2

  // Composer
  composer.render()
}

// OTHER HELPERS
function handlePlayerLeft(playerId: PlayerId) {
  const threeObj = playerThreeObjs[playerId]
  if (threeObj) {
    scene.remove(threeObj.ship)
    scene.remove(threeObj.displayName)
    threeObj.displayName.dispose()
    scene.remove(threeObj.avatar)
  }
  delete playerThreeObjs[playerId]

  const htmlObj = playerHtmlObjs[playerId]
  if (htmlObj) {
    htmlObj.avatar.remove()
  }
  delete playerHtmlObjs[playerId]

  if (playerId === spectatingPlayerId) {
    spectatingPlayerId = getNextSpectatingPlayerId()
  }
}

function getNextSpectatingPlayerId(skipPlayerId?: PlayerId) {
  const playerIds = skipPlayerId
    ? Object.keys(players).filter((playerId) => playerId !== skipPlayerId)
    : Object.keys(players)

  const idx = spectatingPlayerId ? playerIds.indexOf(spectatingPlayerId) + 1 : 0

  return playerIds[idx % playerIds.length]
}

function getPlace(playerId: PlayerId) {
  const completedPlayer = game.completedPlayers[playerId]
  if (completedPlayer) return completedPlayer.place

  // Find place among all players based on positionZ
  const positionZ = game.ships[playerId].position.z
  let place = 1
  Object.values(game.ships).forEach((ship) => {
    // Note that positionZ is negative
    if (ship.position.z < positionZ) {
      place += 1
    }
  })

  return place
}

// RENDERERS
function renderPlace(place: number) {
  const placeSuffix =
    place === 1 ? "st" : place === 2 ? "nd" : place === 3 ? "rd" : "th"

  return `${place}<sup>${placeSuffix}</sup>`
}

function renderSpeed(speed: number) {
  return `${speed.toFixed(0)} km/h`
}

function renderElapse(elapse?: number) {
  if (!elapse) return "-"

  const miliseconds = elapse % 1000
  const seconds = Math.floor(elapse / 1000) % 60
  const minutes = Math.floor(elapse / 1000 / 60)

  return `${minutes.toFixed(0).padStart(2, "0")}:${seconds
    .toFixed(0)
    .padStart(2, "0")}.${miliseconds.toFixed(0).padStart(3, "0")}`
}
