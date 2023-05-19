# This script copies licensed sounds. You can ignore this.

if [ -e ../../../../games-sdk ]; then
  mkdir -p public/sounds
  cp ../../../../games-sdk/gameSounds/sudoku/* public/sounds
fi
