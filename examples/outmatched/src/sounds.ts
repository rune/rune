const sounds = {
  "your-turn": new Audio("sounds/your-turn.wav"),
  arrow: new Audio("sounds/arrow.wav"),
  bomb: new Audio("sounds/bomb.wav"),
  "extra-move": new Audio("sounds/extra-move.wav"),
  "match-1": new Audio("sounds/match-1.wav"),
  "match-2": new Audio("sounds/match-2.wav"),
  "match-3": new Audio("sounds/match-3.wav"),
  "match-arrow": new Audio("sounds/match-arrow.wav"),
  "match-bomb": new Audio("sounds/match-bomb.wav"),
  shuffle: new Audio("sounds/shuffle.wav"),
  swap: new Audio("sounds/swap.wav"),
}

export const playSound = (name: keyof typeof sounds) => {
  const sound = sounds[name]
  try {
    sound.play()
  } catch {
    // Sounds may be blocked by browser
  }
}
