Rune.initClient({
  onChange: ({ game }) => {
    document.getElementById("root")!.innerHTML = JSON.stringify(game)
  },
})
