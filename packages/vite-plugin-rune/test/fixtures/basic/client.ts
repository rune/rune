Rune.initClient({
  onChange: ({ newGame }) => {
    document.getElementById("root")!.innerHTML = JSON.stringify(newGame)
  },
})
