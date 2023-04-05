/* eslint no-undef: 0 */

const panoramasUrl = "https://games-staging.rune.ai/panoramas-test"
const numRounds = 5

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    const rounds = []
    const remainingPanoramas = [...panoramas]

    for (let i = 0; i < numRounds; i++) {
      const randomPanorama = pickRandom(remainingPanoramas)
      remainingPanoramas.splice(remainingPanoramas.indexOf(randomPanorama), 1)
      rounds.push({ panorama: randomPanorama })
    }

    return {
      panoramasUrl,
      playerIds,
      rounds,
      currentRound: 0,
      guesses: [],
    }
  },
  actions: {
    makeGuess: (location, { game, playerId }) => {
      const existingGuess = game.guesses.find(
        (guess) =>
          guess.playerId === playerId && guess.round === game.currentRound
      )

      if (existingGuess) throw Rune.invalidAction()

      const distance = calculateDistanceKm(location, [
        game.rounds[game.currentRound].panorama.longitude,
        game.rounds[game.currentRound].panorama.latitude,
      ])

      game.guesses.push({
        playerId,
        round: game.currentRound,
        location,
        distance,
        score: calculateScore(distance),
      })

      if (game.guesses.length === game.playerIds.length * numRounds) {
        Rune.gameOver({
          players: game.playerIds.reduce(
            (acc, playerId) => ({
              ...acc,
              [playerId]: game.guesses
                .filter((guess) => guess.playerId === playerId)
                .reduce((acc, guess) => acc + guess.score, 0),
            }),
            {}
          ),
        })
      }
    },
    nextRound: (_, { game }) => {
      if (game.currentRound === numRounds - 1) throw Rune.invalidAction()

      const guesses = game.guesses.filter(
        (guess) => guess.round === game.currentRound
      )

      if (guesses.length !== game.playerIds.length) throw Rune.invalidAction()

      game.currentRound++
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      game.playerIds = game.playerIds.filter((id) => id !== playerId)
      game.guesses = game.guesses.filter((guess) => guess.playerId !== playerId)
    },
  },
})

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// From: https://stackoverflow.com/a/21623206
function calculateDistanceKm(from, to) {
  const [lon1, lat1] = from
  const [lon2, lat2] = to

  const p = 0.017453292519943295
  const c = Math.cos
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

  return 12742 * Math.asin(Math.sqrt(a))
}

function calculateScore(dist) {
  const min = 0.1
  const max = 20000
  const clampedDist = clamp(dist, min, max)

  return Math.round(
    Math.abs(
      remap(scoreBase(clampedDist), [scoreBase(min), scoreBase(max)], [1000, 0])
    )
  )
}

function scoreBase(distance) {
  return -Math.log2(distance / 10 - 0.1 + 1)
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function remap(value, [originalMin, originalMax], [newMin, newMax]) {
  return (
    newMin +
    ((value - originalMin) * (newMax - newMin)) / (originalMax - originalMin)
  )
}

const panoramas = [
  {
    name: "piccadilly-circus-london-uk",
    latitude: 51.51002959652788,
    longitude: -0.13449108458632963,
    view: {
      hLookAt: 29.3,
      vLookAt: -10.9,
      fov: 70,
      minFov: 15,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
    ],
  },
  {
    name: "wat-kiri-wong-nakhon-sawan-thailand",
    latitude: 15.7181352683363,
    longitude: 100.125811100006,
    view: {
      hLookAt: 352.3,
      vLookAt: -16,
      fov: 70,
      minFov: 20,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
    ],
  },
  {
    name: "shaanxi-xian-the-eighth-wonder-of-the-world-museum-1-of-the-first-qin-emperor-terracotta-army-and-horses",
    latitude: 34.3890802794568,
    longitude: 109.285265207291,
    view: {
      hLookAt: 184.4,
      vLookAt: -16.7,
      fov: 72.2,
      minFov: 10,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
      {
        level: 3,
        size: 3200,
        tiles: 4,
      },
    ],
  },
  {
    name: "trujillanos-square-spain",
    latitude: 38.9502855142689,
    longitude: -6.261756420135498,
    view: {
      hLookAt: 12.3,
      vLookAt: -25.5,
      fov: 64.4,
      minFov: 5,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
      {
        level: 3,
        size: 3200,
        tiles: 4,
      },
      {
        level: 4,
        size: 6400,
        tiles: 8,
      },
    ],
  },
  {
    name: "cas-borbuintze",
    latitude: 46.5096539213474,
    longitude: 6.96107268333435,
    view: {
      hLookAt: 275.7,
      vLookAt: 0.5,
      fov: 5,
      minFov: 5,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
      {
        level: 3,
        size: 3200,
        tiles: 4,
      },
      {
        level: 4,
        size: 6400,
        tiles: 8,
      },
    ],
  },
  {
    name: "fachada-da-pusada-encontro-das-aguas-em-goncalves-mg",
    latitude: -22.6699073735232,
    longitude: -45.85347890853882,
    view: {
      hLookAt: 1.89999999999998,
      vLookAt: -3.4,
      fov: 70,
      minFov: 10,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
      {
        level: 3,
        size: 3200,
        tiles: 4,
      },
    ],
  },
  {
    name: "matala-beach-caves",
    latitude: 34.995224991067005,
    longitude: 24.74982099021304,
    view: {
      hLookAt: 0,
      vLookAt: 0,
      fov: 70,
      minFov: 5,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
      {
        level: 3,
        size: 3200,
        tiles: 4,
      },
    ],
  },
  {
    name: "teylers-museum-haarlem-the-oval-room",
    latitude: 52.38071097387,
    longitude: 4.63979244232178,
    view: {
      hLookAt: 0.5,
      vLookAt: -1.5,
      fov: 56.1,
      minFov: 10,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
      {
        level: 3,
        size: 3200,
        tiles: 4,
      },
    ],
  },
  {
    name: "swords-in-rock-3-norway",
    latitude: 58.9413383333472,
    longitude: 5.67200500001111,
    view: {
      hLookAt: 12.1,
      vLookAt: 0.3,
      fov: 90,
      minFov: 5,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
      {
        level: 3,
        size: 3200,
        tiles: 4,
      },
    ],
  },
  {
    name: "prague-from-a-balloon",
    latitude: 50.0882184285692,
    longitude: 14.4109082221985,
    view: {
      hLookAt: 0,
      vLookAt: 0,
      fov: 70,
      minFov: 10,
      maxFov: 110,
    },
    levels: [
      {
        level: 2,
        size: 1600,
        tiles: 2,
      },
    ],
  },
]
