Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => ({
    panorama: null,
  }),
  actions: {
    setPanorama: (panorama, { game }) => {
      game.panorama = panorama
    },
  },
  events: {
    playerJoined: () => {},
    playerLeft: () => {},
  },
})
