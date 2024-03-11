const board = document.getElementById("board")
const playersSection = document.getElementById("playersSection")
const selectSound = new Audio("select.wav")

let cellButtons, playerContainers

function initUI(cells, playerIds, players, yourPlayerId) {
  cellButtons = cells.map((_, cellIndex) => {
    const button = document.createElement("button")
    button.addEventListener("click", () => Rune.actions.claimCell(cellIndex))
    board.appendChild(button)
    return button
  })

  playerContainers = playerIds.map((playerId, index) => {
    const { displayName, avatarUrl } = Rune.getPlayerInfo(playerId)
    const li = document.createElement("li")
    li.setAttribute("player", index)
    li.innerHTML =
      `<img src="${avatarUrl}"/>
       <span>${displayName + (playerId === yourPlayerId ? "<br>(You)" : "")}</span>`
    playersSection.appendChild(li)
    return li
  })
}

function onChange({ game, yourPlayerId, action }) {
  const { cells, playerIds, winCombo, lastMovePlayerId, freeCells } = game
  if (!cellButtons) initUI(cells, playerIds, yourPlayerId)
  if (lastMovePlayerId) board.classList.remove("initial")

  cellButtons.forEach((button, i) => {
    button.setAttribute("player", playerIds.indexOf(cells[i]))
    button.setAttribute("dim", (winCombo && !winCombo.includes(i)) || (!freeCells && !winCombo))
    if (!cells[i] && yourPlayerId && lastMovePlayerId !== yourPlayerId && !winCombo)
      button.removeAttribute("disabled")
    else
      button.setAttribute("disabled", "")
  })

  playerContainers.forEach((container, i) => {
    container.setAttribute("your-turn", playerIds[i] !== lastMovePlayerId && !winCombo && freeCells)
  })

  if (action && action.name === "claimCell") selectSound.play()
}

Rune.initClient({ onChange })