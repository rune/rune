Rune.initClient({
  onChange: ({ game }: any) => {
    document.getElementById("root")!.innerHTML = JSON.stringify(game)
  },
})
