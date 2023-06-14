set -e

rm -rf static/_examples
mkdir -p static/_examples

# Tic-tac-toe
cp -r ../examples/tic-tac-toe ./static/_examples/tic-tac-toe

# Sudoku
cd ../examples/sudoku
yarn
yarn build
cp -r build/. ../../docs/static/_examples/sudoku

# Outmatched
cd ../outmatched
yarn
yarn build
cp -r dist/. ../../docs/static/_examples/outmatched
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_examples/outmatched/index.html

# Pinpoint
cd ../pinpoint
yarn
yarn build
cp -r build/. ../../docs/static/_examples/pinpoint
