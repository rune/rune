set -e

rm -rf static/_examples
mkdir -p static/_examples

# Tic-tac-toe
cp -r ../multiplayer/examples/tic-tac-toe ./static/_examples/tic-tac-toe

# Sudoku
cd ../multiplayer/examples/sudoku
yarn
yarn build
cp -r build/. ../../../docs/static/_examples/sudoku
