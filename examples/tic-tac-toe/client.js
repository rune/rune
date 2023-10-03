const board = document.getElementById("board")
const playersList = document.getElementById("players")
const selectSound = new Audio("select.wav")

let buttons, playerItems

Rune.initClient({
  onChange: ({ game, players: playerData, yourPlayerId, action }) => {
    const { cells, players, winCombo, lastPlayerId, gameOver } = game

    board.className = "" // Remove loading class

    // Initialize button elements if not already created
    if (!buttons) {
      buttons = cells.map((_, cellIndex) => {
        const button = document.createElement("button")
        button.addEventListener("click", () =>
          Rune.actions.claimCell(cellIndex)
        )
        board.appendChild(button)
        return button
      })
    }
    const hasPlayableCells = cells.findIndex((cell) => cell === null) !== -1
    buttons.forEach((button, i) => {
      const cell = cells[i]

      // Display claimed cells: players[0] == X, players[1] == O
      const player = players.indexOf(cell)
      button.setAttribute("data-player", player !== -1 ? player : "")

      // Dim non-winning cells
      button.className = (winCombo ? !winCombo.includes(i) : !hasPlayableCells)
        ? "loser"
        : ""

      // Disable button if cell is claimed or not player's turn
      if (lastPlayerId === yourPlayerId || cell) {
        button.setAttribute("disabled", "disabled")
      } else {
        button.removeAttribute("disabled")
      }
    })

    // Initialize player list item elements if not already created
    if (!playerItems) {
      playerItems = players.map((_, i) => {
        const li = document.createElement("li")
        li.setAttribute("data-player", i)
        playersList.appendChild(li)
        return li
      })
    }

    players.forEach((id, i) => {
      const li = playerItems[i]
      const player = playerData[id]
      li.className = id !== lastPlayerId ? "current" : ""
      li.textContent = player && player.displayName
    })

    if (action && action.name === "claimCell") {
      selectSound.play()
    }

    if (gameOver) {
      setTimeout(() => {
        Rune.showGameOverPopUp()
      }, 1500)
    }
  },
})
