Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (players) => ({
    panorama: null,
    players,
  }),
  actions: {
    setPanorama: (panorama, { game }) => {
      game.panorama = panorama
    },
  },
  events: {
    playerLeft: () => {},
  },
})
