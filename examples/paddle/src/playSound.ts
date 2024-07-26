const sounds = {
  playerScore: new Audio("audio/PlayerScore.mp3"),
  opponentScore: new Audio("audio/OponentScore.mp3"),
  opponentHit: new Audio("audio/OpponentHit.mp3"),
  playerHit: new Audio("audio/PlayerHit.wav"),
}

export const playSound = (name: keyof typeof sounds) => {
  const sound = sounds[name]
  try {
    sound.play()
  } catch {
    // Sounds may be blocked by browser
  }
}
