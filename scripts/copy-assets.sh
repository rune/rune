# This script copies game assets for the examples that cannot be provided in
# this repo due to their licensing restrictions. If you've based your game on
# an example game, you can ignore this file and run 'dusk upload' directly.
set -e

ASSETS_DIR="$HOME/.rune/game-asset-import"
WORK_DIR="$PWD"
GAME=$1

if [ -z "$GAME" ]
then
  echo "No game provided"
  exit 1
fi

mkdir -p "$ASSETS_DIR"
cd "$ASSETS_DIR" || exit 1

if [ ! -e "$ASSETS_DIR/game-assets" ]
then
  # If you don't have permission to checkout the assets
  # then carry on regardless so external contributors
  # can still pass the CI checks.
  git clone git@github.com:rune/game-assets.git || exit 0
else
    cd game-assets || exit 1
    git checkout -f staging
    git pull
fi

cd "$WORK_DIR" || exit 1
cp -r "$ASSETS_DIR/game-assets/$GAME/." .
