set -e

rm -rf static/_examples
mkdir -p static/_examples

# Tic-tac-toe
cp -r ../examples/tic-tac-toe ./static/_examples/tic-tac-toe

# Sudoku
cd ../examples/sudoku
yarn
../../scripts/copy-assets.sh sudoku && yarn build
cp -r build/. ../../docs/static/_examples/sudoku

# Outmatched
cd ../outmatched
yarn
../../scripts/copy-assets.sh outmatched && yarn build
cp -r dist/. ../../docs/static/_examples/outmatched
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_examples/outmatched/index.html

# Pinpoint
cd ../pinpoint
yarn
../../scripts/copy-assets.sh pinpoint && yarn build
cp -r build/. ../../docs/static/_examples/pinpoint
