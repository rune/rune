import { Animal, Emotion } from "../../../lib/types/GameState"

import lion from "./animals/lion.png"
import dog from "./animals/dog.png"
import pig from "./animals/pig.png"
import sheep from "./animals/sheep.png"
import elephant from "./animals/elephant.png"
import cow from "./animals/cow.png"
import cat from "./animals/cat.png"
import frog from "./animals/frog.png"
import monkey from "./animals/monkey.png"
import horse from "./animals/horse.png"
import goat from "./animals/goat.png"
import mouse from "./animals/mouse.png"
import owl from "./animals/owl.png"
import duck from "./animals/duck.png"
import chicken from "./animals/chicken.png"

import scared from "./emotions/scared.png"
import crying from "./emotions/crying.png"
import sneezing from "./emotions/sneezing.png"
import ghost from "./emotions/ghost.png"
import cold from "./emotions/cold.png"
import angry from "./emotions/angry.png"
import sleepy from "./emotions/sleepy.png"
import laughing from "./emotions/laughing.png"

export const art: {
  animals: { [K in Animal]: string }
  emotions: { [K in Emotion]: string }
} = {
  animals: {
    lion,
    dog,
    pig,
    sheep,
    elephant,
    cow,
    cat,
    frog,
    monkey,
    horse,
    goat,
    mouse,
    owl,
    duck,
    chicken,
  },
  emotions: {
    scared,
    crying,
    sneezing,
    ghost,
    cold,
    angry,
    sleepy,
    laughing,
  },
}
