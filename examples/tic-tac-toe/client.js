const board = document.getElementById("board")

let buttons

Rune.initClient({
  visualUpdate: ({ newGame, yourPlayerId }) => {
    const { cells, players, winCombo, currentPlayerId } = newGame

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

    buttons.forEach((button, i) => {
      const cell = cells[i]

      // Display claimed cells: players[0] == X, players[1] == O
      const player = players.indexOf(cell)
      button.setAttribute("data-player", player !== -1 ? player : "")

      // Dim non-winning cells
      button.className = (winCombo ? !winCombo.includes(i) : !currentPlayerId)
        ? "loser"
        : ""

      // Disable button if cell is claimed or not player's turn
      if (currentPlayerId !== yourPlayerId || cell) {
        button.setAttribute("disabled", "disabled")
      } else {
        button.removeAttribute("disabled")
      }
    })
  },
})
