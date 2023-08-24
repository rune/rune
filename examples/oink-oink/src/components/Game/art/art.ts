import { Animal, Emotion } from "../../../lib/types/GameState"

import dog from "./animals/dog.png"
import lion from "./animals/lion.png"
import pig from "./animals/pig.png"
import cat from "./animals/cat.png"
import elephant from "./animals/elephant.png"
import frog from "./animals/frog.png"
import cow from "./animals/cow.png"
import sheep from "./animals/sheep.png"

import laughing from "./emotions/laughing.png"
import scared from "./emotions/scared.png"
import angry from "./emotions/angry.png"
import sleepy from "./emotions/sleepy.png"
import sneezing from "./emotions/sneezing.png"
import crying from "./emotions/crying.png"
import ghost from "./emotions/ghost.png"
import cold from "./emotions/cold.png"

// TODO: use new bigger images

export const art: {
  animals: { [K in Animal]: string }
  emotions: { [K in Emotion]: string }
} = {
  animals: { dog, cat, lion, pig, elephant, frog, cow, sheep },
  emotions: { laughing, scared, angry, sleepy, sneezing, crying, ghost, cold },
}
