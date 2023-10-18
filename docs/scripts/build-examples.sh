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

# OinkOink
cd ../oink-oink
yarn
../../scripts/copy-assets.sh oink-oink && yarn build
cp -r build/. ../../docs/static/_examples/oink-oink

# Paddle
cd ../paddle
yarn
../../scripts/copy-assets.sh paddle && yarn build
cp -r dist/. ../../docs/static/_examples/paddle
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_examples/paddle/index.html

# Cube Rush
cd ../cube-rush
yarn
yarn build
cp -r build/. ../../docs/static/_examples/cube-rush
