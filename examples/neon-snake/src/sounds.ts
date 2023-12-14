const sounds = {
  won: new Audio("sounds/won.mp3"),
  lost: new Audio("sounds/lost.mp3"),
  countdown: new Audio("sounds/countdown.mp3"),
  background: new Audio("sounds/background.mp3"),
}

export const playSound = async (name: keyof typeof sounds, rethrow = false) => {
  const sound = sounds[name]
  return sound.play().catch((e) => {
    if (rethrow) {
      throw e
    }
  })
}
